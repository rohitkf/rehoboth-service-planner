import type { TeamKey } from '../types'

export const TEAM_COLORS: Record<TeamKey, string> = {
  audio: '#fce4d6',
  stage: '#e2efda',
  video: '#dce6f1',
  audioAndWorship: '#fff2cc',
  worship: '#f4ccff',
  none: '#ffffff',
}

export const TEAM_LABELS: Record<TeamKey, string> = {
  audio: 'Audio',
  stage: 'Stage',
  video: 'Video',
  audioAndWorship: 'Audio & Worship',
  worship: 'Worship',
  none: '—',
}

export const BLOCK_COLORS = {
  preService: '#1e3a5f',
  english: '#1a4731',
  malayalam: '#4a1942',
  debriefing: '#1e3a5f',
} as const

export const LABEL_ROW_COLOR = '#d9e8ff'
export const SECTION_HEADER_COLOR = '#1e3a5f'
