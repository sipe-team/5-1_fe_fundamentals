import { format, isValid, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

const DATE_LABEL_FORMAT = 'yyyy-MM-dd (EEE)';
const DATE_VALUE_FORMAT = 'yyyy-MM-dd';
const CREATED_AT_FORMAT = 'MM.dd HH:mm';

function parseValidDate(value: string) {
  const parsedDate = parseISO(value);

  return isValid(parsedDate) ? parsedDate : null;
}

export function formatDateLabel(date: string) {
  const parsedDate = parseValidDate(date);

  if (!parsedDate) {
    return date;
  }

  return format(parsedDate, DATE_LABEL_FORMAT, { locale: ko });
}

export function normalizeDateInput(date: string, fallback: string) {
  const parsedDate = parseValidDate(date);

  if (!parsedDate) {
    return fallback;
  }

  return format(parsedDate, DATE_VALUE_FORMAT);
}

export function formatReservationDate(date: string) {
  return formatDateLabel(date);
}

export function formatCreatedAt(createdAt: string) {
  const parsedDate = parseValidDate(createdAt);

  if (!parsedDate) {
    return createdAt;
  }

  return format(parsedDate, CREATED_AT_FORMAT, { locale: ko });
}
