import { queryOptions } from "@tanstack/react-query";
import { requestJson } from "@/reservation/api/client";
import type { RoomsResponse } from "@/reservation/types";

const ROOMS_PATH = "/api/rooms";

export const roomKeys = {
  all: ["rooms"] as const,
};

export function fetchRooms(): Promise<RoomsResponse> {
  return requestJson(ROOMS_PATH);
}

export const roomsQueryOptions = () =>
  queryOptions({
    queryKey: roomKeys.all,
    queryFn: fetchRooms,
  });
