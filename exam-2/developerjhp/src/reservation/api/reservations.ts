import { queryOptions } from "@tanstack/react-query";
import { buildUrl, requestJson } from "@/reservation/api/client";
import type {
  CreateReservationRequest,
  ReservationResponse,
  ReservationsResponse,
} from "@/reservation/types";

const RESERVATIONS_PATH = "/api/reservations";
const MY_RESERVATIONS_PATH = "/api/my-reservations";

export const reservationKeys = {
  all: ["reservations"] as const,
  lists: () => [...reservationKeys.all, "list"] as const,
  list: (date: string) => [...reservationKeys.lists(), date] as const,
  details: () => [...reservationKeys.all, "detail"] as const,
  detail: (id: string) => [...reservationKeys.details(), id] as const,
  my: () => [...reservationKeys.all, "my"] as const,
};

function reservationDetailPath(id: string) {
  return `${RESERVATIONS_PATH}/${id}`;
}

export function fetchReservations(date: string): Promise<ReservationsResponse> {
  return requestJson(
    buildUrl(RESERVATIONS_PATH, {
      date,
    }),
  );
}

export function fetchReservation(id: string): Promise<ReservationResponse> {
  return requestJson(reservationDetailPath(id));
}

export function fetchMyReservations(): Promise<ReservationsResponse> {
  return requestJson(MY_RESERVATIONS_PATH);
}

export function createReservation(
  data: CreateReservationRequest,
): Promise<ReservationResponse> {
  return requestJson(RESERVATIONS_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function deleteReservation(id: string): Promise<{ message: string }> {
  return requestJson(reservationDetailPath(id), { method: "DELETE" });
}

export const reservationsQueryOptions = (date: string) =>
  queryOptions({
    queryKey: reservationKeys.list(date),
    queryFn: () => fetchReservations(date),
  });

export const reservationQueryOptions = (id: string) =>
  queryOptions({
    queryKey: reservationKeys.detail(id),
    queryFn: () => fetchReservation(id),
  });

export const myReservationsQueryOptions = () =>
  queryOptions({
    queryKey: reservationKeys.my(),
    queryFn: fetchMyReservations,
  });
