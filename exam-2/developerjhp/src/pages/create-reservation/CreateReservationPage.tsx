import { SuspenseQuery } from "@suspensive/react-query-5";
import { css } from "@emotion/react";
import { useQueryStates } from "nuqs";
import { useNavigate } from "react-router";
import { ReservationForm } from "@/pages/create-reservation/ReservationForm";
import { useCreateReservation } from "@/reservation/hooks/useCreateReservation";
import { roomsQueryOptions } from "@/reservation/api/rooms";
import {
  createReservationSearchParsers,
  getTimelineSearchValues,
  normalizeCreateReservationSearch,
  serializeTimelineSearch,
} from "@/reservation/searchParams";
import type {
  CreateReservationRequest,
  ReservationResponse,
} from "@/reservation/types";
import { AsyncBoundary } from "@/components/AsyncBoundary";
import { spacing } from "@/styles/tokens";

export function CreateReservationPage() {
  const navigate = useNavigate();
  const mutation = useCreateReservation();
  const [search] = useQueryStates(createReservationSearchParsers);
  const normalizedSearch = normalizeCreateReservationSearch(search);
  const initialRoomId = normalizedSearch.roomId ?? "";
  const initialDate = normalizedSearch.date ?? "";
  const initialStartTime = normalizedSearch.startTime ?? "";
  const timelineSearchValues = getTimelineSearchValues({
    date: initialDate,
    minCapacity: normalizedSearch.minCapacity,
    equipment: normalizedSearch.equipment,
  });

  const handleSubmit = (data: CreateReservationRequest) => {
    mutation.mutate(data, {
      onSuccess: (response: ReservationResponse) => {
        navigate(
          serializeTimelineSearch("/", {
            ...timelineSearchValues,
            date: response.reservation.date,
          }),
        );
      },
    });
  };

  return (
    <div>
      <h1
        css={css`
          margin-bottom: ${spacing.lg};
        `}
      >
        예약 생성
      </h1>
      <AsyncBoundary>
        <SuspenseQuery {...roomsQueryOptions()}>
          {({ data: { rooms } }) => {
            const validRoomId = rooms.some((room) => room.id === initialRoomId)
              ? initialRoomId
              : "";

            return (
              <ReservationForm
                rooms={rooms}
                initialValues={{
                  roomId: validRoomId,
                  date: initialDate,
                  startTime: initialStartTime,
                }}
                onSubmit={handleSubmit}
                isPending={mutation.isPending}
                error={mutation.error}
              />
            );
          }}
        </SuspenseQuery>
      </AsyncBoundary>
    </div>
  );
}
