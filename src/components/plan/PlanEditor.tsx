import type { ServicePlan, Block } from '../../types'
import { BlockCard } from '../block/BlockCard'
import { formatDateDisplay } from '../../utils/time'
import { CalendarDays } from 'lucide-react'

interface Props {
  plan: ServicePlan
  isAdmin: boolean
  onUpdate: (updated: ServicePlan) => void
}

export function PlanEditor({ plan, isAdmin, onUpdate }: Props) {
  function updateBlock(index: number, updated: Block) {
    const blocks = [...plan.plan_data.blocks]
    blocks[index] = updated
    onUpdate({ ...plan, plan_data: { blocks } })
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200 no-print">
        <div className="p-2 bg-navy-100 rounded-xl">
          <CalendarDays className="w-5 h-5 text-navy-900" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{formatDateDisplay(plan.date)}</h1>
          <p className="text-xs text-gray-500">{isAdmin ? 'Admin · Click any cell to edit' : 'Volunteer · View only'}</p>
        </div>
      </div>

      {plan.plan_data.blocks.map((block, index) => (
        <BlockCard
          key={block.id}
          block={block}
          isAdmin={isAdmin}
          onUpdate={updated => updateBlock(index, updated)}
        />
      ))}
    </div>
  )
}
