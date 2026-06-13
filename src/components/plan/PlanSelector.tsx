import { useState } from 'react'
import { Calendar, Plus, Trash2, ChevronRight } from 'lucide-react'
import type { ServicePlan } from '../../types'
import { formatDateDisplay, getNextSunday } from '../../utils/time'

interface Props {
  plans: ServicePlan[]
  activePlanId: string | null
  isAdmin: boolean
  onSelect: (plan: ServicePlan) => void
  onCreate: (date: string) => Promise<void>
  onDelete: (id: string) => void
}

export function PlanSelector({ plans, activePlanId, isAdmin, onSelect, onCreate, onDelete }: Props) {
  const [newDate, setNewDate] = useState(getNextSunday())
  const [creating, setCreating] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  async function handleCreate() {
    if (!newDate) return
    const existing = plans.find(p => p.date === newDate)
    if (existing) { onSelect(existing); setShowCreate(false); return }
    setCreating(true)
    await onCreate(newDate)
    setCreating(false)
    setShowCreate(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-navy-900" />
          <h3 className="font-semibold text-gray-900 text-sm">Service Plans</h3>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1.5 text-xs text-white bg-navy-900 hover:bg-navy-800 px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Plan
          </button>
        )}
      </div>

      {showCreate && isAdmin && (
        <div className="px-5 py-4 bg-navy-50 border-b border-navy-100 flex items-center gap-3">
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-4 py-2 bg-navy-900 text-white text-sm rounded-lg hover:bg-navy-800 disabled:opacity-60 font-medium transition-colors"
          >
            {creating ? 'Creating…' : 'Create'}
          </button>
          <button
            onClick={() => setShowCreate(false)}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {plans.length === 0 ? (
        <div className="px-5 py-8 text-center text-gray-400 text-sm">
          {isAdmin ? 'No plans yet. Create one to get started.' : 'No plans available yet.'}
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {plans.map(plan => (
            <div
              key={plan.id}
              onClick={() => onSelect(plan)}
              className={`flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors ${
                activePlanId === plan.id
                  ? 'bg-navy-50 border-l-4 border-navy-900'
                  : 'hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${activePlanId === plan.id ? 'text-navy-900' : 'text-gray-800'}`}>
                  {formatDateDisplay(plan.date)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(plan.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(plan.id) }}
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <ChevronRight className={`w-4 h-4 ${activePlanId === plan.id ? 'text-navy-900' : 'text-gray-300'}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
