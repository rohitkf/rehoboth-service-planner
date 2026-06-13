import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock } from 'lucide-react'
import type { Block } from '../../types'
import { SessionTable } from './SessionTable'
import { getTotalDuration } from '../../utils/planCalculator'
import { formatTime, parseTime } from '../../utils/time'

interface Props {
  block: Block
  isAdmin: boolean
  onUpdate: (updated: Block) => void
}

export function BlockCard({ block, isAdmin, onUpdate }: Props) {
  const [collapsed, setCollapsed] = useState(false)

  const totalMins = getTotalDuration(block)
  const endMins = parseTime(block.startTime) + totalMins
  const endTime = formatTime(endMins)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer"
        style={{ backgroundColor: block.headerColor }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-white font-bold tracking-widest text-sm">{block.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              {!block.manualTimes && (
                <span className="text-white/70 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {block.startTime} → {endTime} · {totalMins} min
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && !block.manualTimes && (
            <div
              className="flex items-center gap-1.5 bg-white/15 rounded-lg px-2 py-1"
              onClick={e => e.stopPropagation()}
            >
              <Clock className="w-3 h-3 text-white/60" />
              <input
                type="time"
                value={block.startTime}
                onChange={e => onUpdate({ ...block, startTime: e.target.value })}
                className="bg-transparent text-white text-xs outline-none w-20 cursor-pointer"
              />
            </div>
          )}
          <div className="text-white/60">
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Content */}
      {!collapsed && (
        <SessionTable
          block={block}
          isAdmin={isAdmin}
          onUpdateBlock={onUpdate}
        />
      )}
    </div>
  )
}
