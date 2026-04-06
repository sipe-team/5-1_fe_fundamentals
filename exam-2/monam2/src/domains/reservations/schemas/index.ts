import { z } from "zod";

const timePattern = /^\d{2}:\d{2}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export type NewReservationFormInput = z.input<typeof newReservationFormSchema>;
export type NewReservationFormOutput = z.output<
  typeof newReservationFormSchema
>;

export const newReservationFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "회의 제목을 입력해주세요.")
      .max(30, "회의 제목은 30자 이하로 입력해주세요."),
    organizer: z
      .string()
      .trim()
      .min(1, "예약자명을 입력해주세요.")
      .max(10, "예약자명은 10자 이하로 입력해주세요."),
    roomId: z.string().trim().min(1, "회의실을 선택해주세요."),
    date: z
      .string()
      .trim()
      .min(1, "날짜를 선택해주세요.")
      .regex(datePattern, "올바른 날짜 형식을 입력해주세요."),
    attendees: z
      .string()
      .trim()
      .min(1, "참석 인원을 입력해주세요.")
      .refine(
        (value) => /^\d+$/.test(value) && Number(value) > 0,
        "1명 이상의 숫자를 입력해주세요.",
      )
      .transform((value) => Number(value)),
    startTime: z
      .string()
      .trim()
      .min(1, "시작 시간을 선택해주세요.")
      .regex(timePattern, "올바른 시작 시간을 입력해주세요."),
    endTime: z
      .string()
      .trim()
      .min(1, "종료 시간을 선택해주세요.")
      .regex(timePattern, "올바른 종료 시간을 입력해주세요."),
  })
  .superRefine((values, context) => {
    if (
      timePattern.test(values.startTime) &&
      timePattern.test(values.endTime) &&
      values.startTime >= values.endTime
    ) {
      context.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "종료 시간은 시작 시간보다 늦어야 합니다.",
      });
    }
  });
