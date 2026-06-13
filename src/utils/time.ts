export function parseTime(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

export function formatTime(totalMins: number): string {
  const normalized = ((totalMins % 1440) + 1440) % 1440
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  const period = h < 12 ? 'AM' : 'PM'
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
}

export function formatTime24(totalMins: number): string {
  const normalized = ((totalMins % 1440) + 1440) % 1440
  const h = Math.floor(normalized / 60)
  const m = normalized % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export function addMinutes(hhmm: string, delta: number): string {
  return formatTime24(parseTime(hhmm) + delta)
}

export function formatDateDisplay(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00')
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function getNextSunday(): string {
  const today = new Date()
  const day = today.getDay()
  const daysUntilSunday = day === 0 ? 0 : 7 - day
  const sunday = new Date(today)
  sunday.setDate(today.getDate() + daysUntilSunday)
  return sunday.toISOString().split('T')[0]!
}
