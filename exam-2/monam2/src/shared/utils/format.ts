import { ko } from "date-fns/locale";
import { format, isValid, parseISO } from "date-fns";

export function formatReservationDate(date: string) {
  const parsedDate = parseISO(date);

  if (!isValid(parsedDate)) {
    return date;
  }

  return format(parsedDate, "yyyy-MM-dd (EEE)", { locale: ko });
}

export function formatCreatedAt(createdAt: string) {
  const parsedDate = parseISO(createdAt);

  if (!isValid(parsedDate)) {
    return createdAt;
  }

  return format(parsedDate, "MM.dd HH:mm", { locale: ko });
}
