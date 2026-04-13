import type {
  CreateReservationRequest,
  ReservationResponse,
  ReservationsResponse,
  RoomsResponse,
} from '@/types/reservation'
import apiClient from './client'

export function getRooms() {
  return apiClient<RoomsResponse>('/api/rooms')
}

export function getReservations(date: string) {
  return apiClient<ReservationsResponse>(`/api/reservations?date=${date}`)
}

export function getReservation(id: string) {
  return apiClient<ReservationResponse>(`/api/reservations/${id}`)
}

export function getMyReservations() {
  return apiClient<ReservationsResponse>('/api/my-reservations')
}

export function createReservation(body: CreateReservationRequest) {
  return apiClient<ReservationResponse>('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function deleteReservation(id: string) {
  return apiClient<{ message: string }>(`/api/reservations/${id}`, {
    method: 'DELETE',
  })
}
