export function formatOrderDateTime(date: string): string {
  return new Date(date).toLocaleString('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
