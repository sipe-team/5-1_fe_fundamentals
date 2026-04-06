import type { ConflictError, ReservationResponse } from './reservation';

export type NewReservationResponseType =
  | ReservationResponse
  | ApiErrorResponse
  | ConflictError;

export interface ApiMessageResponse {
  message: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
}
