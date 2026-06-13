import type { Block, ComputedSession } from '../types'
import { parseTime, formatTime } from './time'

export function computeSessionTimes(block: Block): ComputedSession[] {
  if (block.manualTimes) {
    return block.sessions.map(s => ({ ...s, computedStartTime: null }))
  }

  let current = parseTime(block.startTime)

  return block.sessions.map(session => {
    if (session.isLabelRow) {
      return { ...session, computedStartTime: null }
    }
    const computedStartTime = formatTime(current)
    if (session.duration) {
      current += session.duration
    }
    return { ...session, computedStartTime }
  })
}

export function getTotalDuration(block: Block): number {
  return block.sessions
    .filter(s => !s.isLabelRow && s.duration)
    .reduce((acc, s) => acc + (s.duration ?? 0), 0)
}
