import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { PlusCircle, AlignLeft } from 'lucide-react'
import type { Block, ComputedSession, Session } from '../../types'
import { computeSessionTimes } from '../../utils/planCalculator'
import { SessionRow } from '../session/SessionRow'
import { useToast } from '../../hooks/useToast'

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
  const { showToast, showUndoToast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const computed = computeSessionTimes(block)

  function updateSession(index: number, updated: ComputedSession) {
    const sessions = [...block.sessions]
    const { computedStartTime: _cst, ...sessionData } = updated
    void _cst
    sessions[index] = { ...sessionData, rowColor: sessionData.rowColor ?? '' }
    onUpdateBlock({ ...block, sessions })
  }

  function deleteSession(index: number) {
    const removed = block.sessions[index]
    const sessions = block.sessions.filter((_, i) => i !== index)
    onUpdateBlock({ ...block, sessions })
    showUndoToast(
      `Deleted "${removed?.description || 'row'}"`,
      () => {
        const restored = [...sessions]
        restored.splice(index, 0, removed!)
        onUpdateBlock({ ...block, sessions: restored })
        showToast('Restored', 'success')
      },
    )
  }

  function addSession(isLabelRow: boolean) {
    const sessions = [...block.sessions, makeSession(isLabelRow)]
    onUpdateBlock({ ...block, sessions })
    showToast(isLabelRow ? 'Label row added' : 'Session added', 'success')
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = block.sessions.findIndex(s => s.id === active.id)
    const to = block.sessions.findIndex(s => s.id === over.id)
    if (from === -1 || to === -1) return
    onUpdateBlock({ ...block, sessions: arrayMove(block.sessions, from, to) })
  }

  return (
    <div className="overflow-x-auto">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
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
            <SortableContext items={block.sessions.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {computed.map((session, index) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  isAdmin={isAdmin}
                  manualTimes={block.manualTimes}
                  onUpdate={updated => updateSession(index, updated)}
                  onDelete={() => deleteSession(index)}
                />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </DndContext>

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
