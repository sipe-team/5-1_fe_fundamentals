import { SuspenseQuery } from "@suspensive/react-query-5";
import { css } from "@emotion/react";
import { useQueryStates } from "nuqs";
import { useNavigate } from "react-router";
import { ReservationForm } from "@/pages/create-reservation/ReservationForm";
import { useCreateReservation } from "@/reservation/hooks/useCreateReservation";
import { HttpError } from "@/reservation/api/client";
import { roomsQueryOptions } from "@/reservation/api/rooms";
import {
  createReservationSearchParsers,
  normalizeCreateReservationSearch,
  serializeTimelineSearch,
} from "@/reservation/searchParams";
import type {
  CreateReservationRequest,
  ReservationResponse,
  SubmitError,
} from "@/reservation/types";
import { isConflictErrorBody } from "@/reservation/types";
import { AsyncBoundary } from "@/components/AsyncBoundary";
import { spacing } from "@/styles/tokens";

export function CreateReservationPage() {
  const navigate = useNavigate();
  const mutation = useCreateReservation();
  const [search] = useQueryStates(createReservationSearchParsers);
  const normalizedSearch = normalizeCreateReservationSearch(search);
  const submitError = parseSubmitError(mutation.error);

  return (
    <div>
      <h1
        css={css`
          margin-bottom: ${spacing.lg};
        `}
      >
        예약 생성
      </h1>
      <AsyncBoundary pendingFallback={<p>예약 생성을 준비하는 중입니다.</p>}>
        <SuspenseQuery {...roomsQueryOptions()}>
          {({ data: { rooms } }) => {
            const initialValues = {
              roomId: rooms.some((room) => room.id === normalizedSearch.roomId)
                ? normalizedSearch.roomId ?? ""
                : "",
              date: normalizedSearch.date ?? "",
              startTime: normalizedSearch.startTime ?? "",
            };

            return (
              <ReservationForm
                rooms={rooms}
                initialValues={initialValues}
                onSubmit={(data: CreateReservationRequest) => {
                  mutation.mutate(data, {
                    onSuccess: (response: ReservationResponse) => {
                      navigate(
                        serializeTimelineSearch("/", {
                          date: response.reservation.date,
                          minCapacity: normalizedSearch.minCapacity ?? null,
                          equipment: normalizedSearch.equipment ?? null,
                        }),
                      );
                    },
                  });
                }}
                isPending={mutation.isPending}
                submitError={submitError}
              />
            );
          }}
        </SuspenseQuery>
      </AsyncBoundary>
    </div>
  );
}

function parseSubmitError(error: Error | null): SubmitError | null {
  if (!error) return null;

  if (
    error instanceof HttpError &&
    error.status === 409 &&
    isConflictErrorBody(error.body)
  ) {
    const { conflictWith } = error.body;
    return {
      type: "conflict",
      message: "시간 충돌",
      conflict: {
        title: conflictWith.title,
        startTime: conflictWith.startTime,
        endTime: conflictWith.endTime,
      },
    };
  }

  if (error instanceof HttpError && error.status >= 500) {
    return {
      type: "server",
      message: "서버 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }

  return { type: "server", message: error.message };
}
