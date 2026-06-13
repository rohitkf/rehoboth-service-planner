import { useState, useRef } from 'react'
import { Trash2, GripVertical, Check, X } from 'lucide-react'
import type { ComputedSession, TeamKey } from '../../types'
import { TEAM_COLORS, TEAM_LABELS } from '../../constants/colors'

interface Props {
  session: ComputedSession
  isAdmin: boolean
  manualTimes: boolean
  onUpdate: (updated: ComputedSession) => void
  onDelete: () => void
  isDragOver?: boolean
  dragHandlers?: {
    onDragStart: () => void
    onDragOver: (e: React.DragEvent) => void
    onDragEnd: () => void
  }
}

const TEAMS: TeamKey[] = ['none', 'audio', 'stage', 'video', 'audioAndWorship', 'worship']

export function SessionRow({ session, isAdmin, manualTimes, onUpdate, onDelete, isDragOver, dragHandlers }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(session)
  const rowRef = useRef<HTMLTableRowElement>(null)

  const bgColor = session.rowColor || (session.isLabelRow ? '#c6efce' : TEAM_COLORS[session.team])

  function startEdit() {
    if (!isAdmin) return
    setDraft({ ...session })
    setEditing(true)
  }

  function save() {
    onUpdate(draft)
    setEditing(false)
  }

  function cancel() {
    setDraft(session)
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') cancel()
  }

  const trClass = [
    'group border-t border-gray-100 transition-all',
    isDragOver ? 'border-t-2 border-navy-900' : '',
  ].join(' ')

  const manualTimeValue = session.computedStartTime ?? ''

  if (session.isLabelRow) {
    return (
      <tr
        ref={rowRef}
        className={trClass}
        style={{ backgroundColor: bgColor }}
        draggable={isAdmin}
        {...dragHandlers}
      >
        {isAdmin && (
          <td className="w-6 px-1">
            <span className="cursor-grab text-gray-400 opacity-0 group-hover:opacity-100 flex items-center">
              <GripVertical className="w-3 h-3" />
            </span>
          </td>
        )}
        <td colSpan={4} className="py-2 px-4 text-center font-semibold text-sm text-gray-700 tracking-wide">
          {editing ? (
            <input
              autoFocus
              value={draft.description}
              onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
              onKeyDown={handleKeyDown}
              className="w-full text-center bg-transparent border-b border-gray-400 outline-none text-sm font-semibold"
            />
          ) : (
            <span onClick={startEdit} className={isAdmin ? 'cursor-pointer' : ''}>{session.description}</span>
          )}
        </td>
        <td className="py-2 px-2 text-right">
          {editing ? (
            <div className="flex items-center justify-end gap-1">
              <button onClick={save} className="p-1 text-green-600 hover:bg-green-100 rounded"><Check className="w-3 h-3" /></button>
              <button onClick={cancel} className="p-1 text-gray-500 hover:bg-gray-100 rounded"><X className="w-3 h-3" /></button>
            </div>
          ) : isAdmin ? (
            <button onClick={onDelete} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-3 h-3" />
            </button>
          ) : null}
        </td>
      </tr>
    )
  }

  return (
    <tr
      ref={rowRef}
      className={trClass}
      style={{ backgroundColor: bgColor }}
      draggable={isAdmin}
      {...dragHandlers}
    >
      {isAdmin && (
        <td className="w-6 px-1">
          <span className="cursor-grab text-gray-300 group-hover:text-gray-400 flex items-center">
            <GripVertical className="w-3 h-3" />
          </span>
        </td>
      )}

      {/* Time */}
      <td className="py-2 px-3 text-xs font-mono text-gray-700 whitespace-nowrap">
        {manualTimes ? (
          editing ? (
            <input
              type="time"
              value={manualTimeValue}
              onChange={e => setDraft(d => ({ ...d, computedStartTime: e.target.value }))}
              className="w-24 bg-transparent border-b border-gray-400 outline-none text-xs font-mono"
            />
          ) : (
            <span onClick={startEdit} className={isAdmin ? 'cursor-pointer' : ''}>{session.computedStartTime ?? '—'}</span>
          )
        ) : (
          <span className="text-gray-600">{session.computedStartTime ?? '—'}</span>
        )}
      </td>

      {/* Duration */}
      <td className="py-2 px-3 text-xs text-center text-gray-600 whitespace-nowrap">
        {editing ? (
          <input
            type="number"
            value={draft.duration ?? ''}
            onChange={e => setDraft(d => ({ ...d, duration: e.target.value ? Number(e.target.value) : null }))}
            min={1}
            max={999}
            className="w-14 bg-white/80 border border-gray-300 rounded px-1 py-0.5 text-center outline-none text-xs focus:ring-1 focus:ring-navy-900"
          />
        ) : (
          <span onClick={startEdit} className={isAdmin ? 'cursor-pointer' : ''}>{session.duration ?? '—'}</span>
        )}
      </td>

      {/* In Charge */}
      <td className="py-2 px-3 text-xs text-gray-700">
        {editing ? (
          <input
            value={draft.inCharge}
            onChange={e => setDraft(d => ({ ...d, inCharge: e.target.value }))}
            onKeyDown={handleKeyDown}
            placeholder="Name"
            className="w-full bg-white/80 border border-gray-300 rounded px-2 py-0.5 outline-none text-xs focus:ring-1 focus:ring-navy-900"
          />
        ) : (
          <span onClick={startEdit} className={`${isAdmin ? 'cursor-pointer' : ''} ${!session.inCharge ? 'text-gray-400 italic' : ''}`}>
            {session.inCharge || (isAdmin ? 'Add name…' : '—')}
          </span>
        )}
      </td>

      {/* Description */}
      <td className="py-2 px-3 text-xs text-gray-800 font-medium">
        {editing ? (
          <input
            autoFocus
            value={draft.description}
            onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
            onKeyDown={handleKeyDown}
            placeholder="Description"
            className="w-full bg-white/80 border border-gray-300 rounded px-2 py-0.5 outline-none text-xs focus:ring-1 focus:ring-navy-900"
          />
        ) : (
          <span onClick={startEdit} className={isAdmin ? 'cursor-pointer' : ''}>
            {session.description || <span className="text-gray-400 italic">Click to edit…</span>}
          </span>
        )}
      </td>

      {/* Team */}
      <td className="py-2 px-3 text-xs text-gray-600 whitespace-nowrap">
        {editing ? (
          <select
            value={draft.team}
            onChange={e => setDraft(d => ({ ...d, team: e.target.value as TeamKey }))}
            className="bg-white/80 border border-gray-300 rounded px-1 py-0.5 outline-none text-xs focus:ring-1 focus:ring-navy-900"
          >
            {TEAMS.map(t => <option key={t} value={t}>{TEAM_LABELS[t]}</option>)}
          </select>
        ) : (
          <span onClick={startEdit} className={isAdmin ? 'cursor-pointer' : ''}>
            {session.team !== 'none' ? TEAM_LABELS[session.team] : ''}
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="py-2 px-2 text-right whitespace-nowrap">
        {editing ? (
          <div className="flex items-center justify-end gap-1">
            <button onClick={save} className="p-1 text-green-600 hover:bg-green-100 rounded"><Check className="w-3 h-3" /></button>
            <button onClick={cancel} className="p-1 text-gray-500 hover:bg-gray-100 rounded"><X className="w-3 h-3" /></button>
          </div>
        ) : isAdmin ? (
          <button onClick={onDelete} className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 className="w-3 h-3" />
          </button>
        ) : null}
      </td>
    </tr>
  )
}
