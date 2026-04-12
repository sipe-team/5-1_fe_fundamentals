import { delay, HttpResponse, http } from "msw";
import type {
  CreateReservationRequest,
  Reservation,
} from "@/shared/types/reservation";
import { initialReservations } from "./data";
import {
  getMockControls,
  getStoredReservations,
  getStoredRooms,
  initializeMockStorage,
  setStoredReservations,
} from "./storage";

/**
 * 간헐적으로 긴 지연(~5초)이 발생합니다.
 * 약 15%의 확률로 1.5~5초, 나머지는 300~800ms
 */
function randomDelay(): number {
  const controls = getMockControls();

  if (controls.forceDelay) {
    return 4000;
  }

  if (Math.random() < 0.15) {
    return Math.random() * 3500 + 1500;
  }
  return Math.random() * 500 + 300;
}

/**
 * 약 10%의 확률로 에러를 반환합니다.
 * 500 또는 503 상태 코드를 무작위로 선택합니다.
 */
function maybeError(): Response | null {
  const controls = getMockControls();

  if (controls.forceError) {
    return HttpResponse.json(
      {
        error: "Internal Server Error",
        message: "개발자 도구 패널에서 강제 에러가 활성화되었습니다.",
      },
      { status: 500 },
    );
  }

  if (Math.random() < 0.1) {
    const status = Math.random() < 0.5 ? 500 : 503;
    return HttpResponse.json(
      {
        error:
          status === 500
            ? "Internal Server Error"
            : "Service Temporarily Unavailable",
        message:
          status === 500
            ? "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
            : "서버가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.",
      },
      { status },
    );
  }
  return null;
}

/**
 * 시간 충돌을 검사합니다.
 * 같은 회의실, 같은 날짜에 시간이 겹치는 예약이 있으면 해당 예약을 반환합니다.
 */
function findConflict(
  reservations: Reservation[],
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeId?: string,
): Reservation | null {
  return (
    reservations.find(
      (r) =>
        r.roomId === roomId &&
        r.date === date &&
        r.id !== excludeId &&
        r.startTime < endTime &&
        r.endTime > startTime,
    ) ?? null
  );
}

function getNextReservationId(reservations: Reservation[]): string {
  const maxId = reservations.reduce((currentMax, reservation) => {
    const idNumber = Number.parseInt(reservation.id.replace("rsv-", ""), 10);

    if (Number.isNaN(idNumber)) {
      return currentMax;
    }

    return Math.max(currentMax, idNumber);
  }, 0);

  return `rsv-${String(maxId + 1).padStart(3, "0")}`;
}

export const handlers = [
  // ── 회의실 목록 ──────────────────────────────────────
  http.get("/api/rooms", async () => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const rooms = getStoredRooms();
    return HttpResponse.json({ rooms });
  }),

  // ── 예약 목록 (날짜별) ──────────────────────────────
  http.get("/api/reservations", async ({ request }) => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const url = new URL(request.url);
    const date = url.searchParams.get("date");

    if (!date) {
      return HttpResponse.json(
        { error: "Bad Request", message: "date 파라미터가 필요합니다." },
        { status: 400 },
      );
    }

    const reservations = getStoredReservations();
    const filtered = reservations.filter((r) => r.date === date);
    return HttpResponse.json({ reservations: filtered });
  }),

  // ── 예약 상세 ────────────────────────────────────────
  http.get("/api/reservations/:id", async ({ params }) => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const { id } = params;
    const reservations = getStoredReservations();
    const reservation = reservations.find((r) => r.id === id);

    if (!reservation) {
      return HttpResponse.json(
        { error: "Not Found", message: "해당 예약을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return HttpResponse.json({ reservation });
  }),

  // ── 내 예약 목록 ────────────────────────────────────
  http.get("/api/my-reservations", async () => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const reservations = getStoredReservations();
    // Mock에서는 현재 세션에서 생성된 예약 + 초기 데이터 중 '김철수' 예약을 반환
    const myReservations = reservations.filter(
      (r) =>
        r.organizer === "김철수" ||
        !initialReservations.some((ir) => ir.id === r.id),
    );

    return HttpResponse.json({ reservations: myReservations });
  }),

  // ── 예약 생성 ────────────────────────────────────────
  http.post("/api/reservations", async ({ request }) => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const body = (await request.json()) as CreateReservationRequest;
    const rooms = getStoredRooms();
    const reservations = getStoredReservations();

    // 필수 필드 검증
    if (
      !body.roomId ||
      !body.date ||
      !body.startTime ||
      !body.endTime ||
      !body.title ||
      !body.organizer
    ) {
      return HttpResponse.json(
        { error: "Bad Request", message: "필수 필드가 누락되었습니다." },
        { status: 400 },
      );
    }

    // 회의실 존재 확인
    const room = rooms.find((r) => r.id === body.roomId);
    if (!room) {
      return HttpResponse.json(
        { error: "Bad Request", message: "존재하지 않는 회의실입니다." },
        { status: 400 },
      );
    }

    // 시간 유효성 검증
    if (body.startTime >= body.endTime) {
      return HttpResponse.json(
        {
          error: "Bad Request",
          message: "종료 시간은 시작 시간보다 이후여야 합니다.",
        },
        { status: 400 },
      );
    }

    // 시간 충돌 검사
    const conflict = findConflict(
      reservations,
      body.roomId,
      body.date,
      body.startTime,
      body.endTime,
    );

    if (conflict) {
      return HttpResponse.json(
        {
          error: "Conflict",
          message: "해당 시간대에 이미 예약이 존재합니다.",
          conflictWith: {
            id: conflict.id,
            title: conflict.title,
            startTime: conflict.startTime,
            endTime: conflict.endTime,
          },
        },
        { status: 409 },
      );
    }

    const newReservation: Reservation = {
      id: getNextReservationId(reservations),
      roomId: body.roomId,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      title: body.title,
      organizer: body.organizer,
      attendees: body.attendees ?? 1,
      createdAt: new Date().toISOString(),
    };

    setStoredReservations([...reservations, newReservation]);

    return HttpResponse.json({ reservation: newReservation }, { status: 201 });
  }),

  // ── 예약 취소 ────────────────────────────────────────
  http.delete("/api/reservations/:id", async ({ params }) => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const { id } = params;
    const reservations = getStoredReservations();
    const index = reservations.findIndex((r) => r.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { error: "Not Found", message: "해당 예약을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const nextReservations = reservations.filter(
      (reservation) => reservation.id !== id,
    );
    setStoredReservations(nextReservations);

    return HttpResponse.json({ message: "예약이 취소되었습니다." });
  }),
];
