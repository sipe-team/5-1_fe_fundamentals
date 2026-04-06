import { SuspenseQuery } from "@suspensive/react-query-5";
import { css } from "@emotion/react";
import { ReservationForm } from "@/pages/create-reservation/ReservationForm";
import { useCreateReservationPage } from "@/pages/create-reservation/useCreateReservationPage";
import { roomsQueryOptions } from "@/reservation/api/rooms";
import { AsyncBoundary } from "@/components/AsyncBoundary";
import { spacing } from "@/styles/tokens";

export function CreateReservationPage() {
  const { mutation, initialValues, getValidRoomId, submit } =
    useCreateReservationPage();

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
            const validRoomId = getValidRoomId(rooms);

            return (
              <ReservationForm
                rooms={rooms}
                initialValues={{
                  roomId: validRoomId,
                  date: initialValues.date,
                  startTime: initialValues.startTime,
                }}
                onSubmit={submit}
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
