export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function timeToMinutes(time: string): number {
  const [hour, minute] = time.split(':').map(Number)
  return hour * 60 + minute
}
