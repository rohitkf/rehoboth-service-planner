import { useState } from 'react'
import { PlusCircle, AlignLeft } from 'lucide-react'
import type { Block, ComputedSession, Session } from '../../types'
import { computeSessionTimes } from '../../utils/planCalculator'
import { SessionRow } from '../session/SessionRow'

interface Props {
  block: Block
  isAdmin: boolean
  onUpdateBlock: (updated: Block) => void
}

function makeSession(isLabelRow: boolean): Session {
  return {
    id: crypto.randomUUID(),
    isLabelRow,
    description: '',
    duration: isLabelRow ? null : 10,
    inCharge: '',
    team: 'none',
    rowColor: '',
  }
}

export function SessionTable({ block, isAdmin, onUpdateBlock }: Props) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const computed = computeSessionTimes(block)

  function updateSession(index: number, updated: ComputedSession) {
    const sessions = [...block.sessions]
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { computedStartTime: _cst, ...sessionData } = updated
    sessions[index] = { ...sessionData, rowColor: sessionData.rowColor ?? '' }
    onUpdateBlock({ ...block, sessions })
  }

  function deleteSession(index: number) {
    const sessions = block.sessions.filter((_, i) => i !== index)
    onUpdateBlock({ ...block, sessions })
  }

  function addSession(isLabelRow: boolean) {
    const sessions = [...block.sessions, makeSession(isLabelRow)]
    onUpdateBlock({ ...block, sessions })
  }

  function moveSession(from: number, to: number) {
    const sessions = [...block.sessions]
    const [moved] = sessions.splice(from, 1)
    if (moved) sessions.splice(to, 0, moved)
    onUpdateBlock({ ...block, sessions })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
            {isAdmin && <th className="w-6 px-1" />}
            <th className="py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Time</th>
            <th className="py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Dur (min)</th>
            <th className="py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">In Charge</th>
            <th className="py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
            <th className="py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Team</th>
            {isAdmin && <th className="w-10" />}
          </tr>
        </thead>
        <tbody>
          {computed.map((session, index) => (
            <SessionRow
              key={session.id}
              session={session}
              isAdmin={isAdmin}
              manualTimes={block.manualTimes}
              onUpdate={updated => updateSession(index, updated)}
              onDelete={() => deleteSession(index)}
              isDragOver={dragOverIndex === index && draggingIndex !== index}
              dragHandlers={{
                onDragStart: () => setDraggingIndex(index),
                onDragOver: (e) => { e.preventDefault(); setDragOverIndex(index) },
                onDragEnd: () => {
                  if (draggingIndex !== null && dragOverIndex !== null && draggingIndex !== dragOverIndex) {
                    moveSession(draggingIndex, dragOverIndex)
                  }
                  setDraggingIndex(null)
                  setDragOverIndex(null)
                },
              }}
            />
          ))}
        </tbody>
      </table>

      {isAdmin && (
        <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
          <button
            onClick={() => addSession(false)}
            className="flex items-center gap-1.5 text-xs text-navy-900 hover:text-navy-700 font-medium transition-colors px-2 py-1 hover:bg-navy-50 rounded-lg"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add session
          </button>
          <button
            onClick={() => addSession(true)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors px-2 py-1 hover:bg-gray-100 rounded-lg"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            Add label
          </button>
        </div>
      )}
    </div>
  )
}
