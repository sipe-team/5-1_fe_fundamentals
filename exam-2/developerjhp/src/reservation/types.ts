export type Equipment =
  | 'monitor'
  | 'whiteboard'
  | 'video_conference'
  | 'projector';

export interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: Equipment[];
}

export interface Reservation {
  id: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  organizer: string;
  attendees: number;
  createdAt: string;
}

export interface RoomsResponse {
  rooms: Room[];
}

export interface ReservationsResponse {
  reservations: Reservation[];
}

export interface ReservationResponse {
  reservation: Reservation;
}

export interface CreateReservationRequest {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  organizer: string;
  attendees: number;
}

export interface ConflictError {
  error: 'Conflict';
  message: string;
  conflictWith: {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
  };
}

export function isConflictErrorBody(body: unknown): body is ConflictError {
  return (
    body != null &&
    typeof body === 'object' &&
    'error' in body &&
    (body as ConflictError).error === 'Conflict' &&
    'conflictWith' in body
  );
}

export interface SubmitError {
  type: 'conflict' | 'server';
  message: string;
  conflict?: {
    title: string;
    startTime: string;
    endTime: string;
  };
}
