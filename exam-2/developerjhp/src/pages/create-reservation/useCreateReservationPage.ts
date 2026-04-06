import { useQueryStates } from "nuqs";
import { useNavigate } from "react-router";
import { useCreateReservation } from "@/reservation/hooks/useCreateReservation";
import {
  createReservationSearchParsers,
  getTimelineSearchValues,
  normalizeCreateReservationSearch,
  serializeTimelineSearch,
} from "@/reservation/searchParams";
import type {
  CreateReservationRequest,
  ReservationResponse,
  Room,
} from "@/reservation/types";

export function useCreateReservationPage() {
  const navigate = useNavigate();
  const mutation = useCreateReservation();
  const [search] = useQueryStates(createReservationSearchParsers);
  const normalizedSearch = normalizeCreateReservationSearch(search);

  const roomId = normalizedSearch.roomId ?? "";
  const date = normalizedSearch.date ?? "";
  const startTime = normalizedSearch.startTime ?? "";
  const timelineSearchValues = getTimelineSearchValues({
    date,
    minCapacity: normalizedSearch.minCapacity,
    equipment: normalizedSearch.equipment,
  });

  return {
    mutation,
    initialValues: {
      roomId,
      date,
      startTime,
    },
    getValidRoomId(rooms: Room[]) {
      return rooms.some((room) => room.id === roomId) ? roomId : "";
    },
    submit(data: CreateReservationRequest) {
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
    },
  };
}
