import { client } from "@/shared/apis";
import type {
  CreateReservationRequest,
  NewReservationResponseType,
} from "@/shared/types";

export default function postReservation(payload: CreateReservationRequest) {
  return client
    .post("reservations", {
      json: payload,
      throwHttpErrors: false, // 4xx, 5xx 에러를 throw 하지 않고 다른 레이어에서 처리
    })
    .json<NewReservationResponseType>();
}
