import type { ServicePlan } from '../../types'
import { computeSessionTimes } from '../../utils/planCalculator'
import { TEAM_COLORS, TEAM_LABELS } from '../../constants/colors'
import { formatDateDisplay } from '../../utils/time'

interface Props {
  plan: ServicePlan
}

export function PlanPrintView({ plan }: Props) {
  return (
    <div className="print-only" style={{ fontFamily: 'Arial, sans-serif', fontSize: '9pt', color: '#000' }}>
      {/* REHOBOTH LONDON Header */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8f 100%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '4px',
          display: 'inline-block',
          marginBottom: '4px',
        }}>
          <div style={{ fontSize: '22pt', fontWeight: '900', letterSpacing: '6px', lineHeight: 1.1 }}>REHOBOTH</div>
          <div style={{ fontSize: '14pt', fontWeight: '700', letterSpacing: '16px', lineHeight: 1.3 }}>LONDON</div>
        </div>
        <div style={{ fontSize: '8pt', color: '#555', marginTop: '4px', letterSpacing: '2px' }}>
          SUNDAY SERVICE PLANNER · {formatDateDisplay(plan.date).toUpperCase()}
        </div>
      </div>

      {/* Blocks */}
      {plan.plan_data.blocks.map(block => {
        const computed = computeSessionTimes(block)
        return (
          <div key={block.id} style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
            {/* Block header */}
            <table style={{ width: '100%', borderCollapse: 'collapse', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' } as React.CSSProperties}>
              <thead>
                <tr style={{ backgroundColor: block.headerColor }}>
                  <td colSpan={5} style={{
                    color: 'white',
                    fontWeight: '900',
                    fontSize: '9pt',
                    letterSpacing: '3px',
                    padding: '6px 10px',
                    textAlign: 'center',
                  }}>
                    {block.name}
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1.5px solid #ccc' }}>
                  <th style={{ padding: '4px 8px', fontSize: '7pt', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', width: '70px', whiteSpace: 'nowrap' }}>Time</th>
                  <th style={{ padding: '4px 8px', fontSize: '7pt', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', width: '70px', textAlign: 'center' }}>Duration<br />(mins)</th>
                  <th style={{ padding: '4px 8px', fontSize: '7pt', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', width: '110px' }}>In Charge</th>
                  <th style={{ padding: '4px 8px', fontSize: '7pt', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</th>
                  <th style={{ padding: '4px 8px', fontSize: '7pt', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', width: '90px' }}>Team</th>
                </tr>
              </thead>
              <tbody>
                {computed.map(session => {
                  const bg = session.rowColor || (session.isLabelRow ? '#c6efce' : TEAM_COLORS[session.team])
                  if (session.isLabelRow) {
                    return (
                      <tr key={session.id} style={{ backgroundColor: bg, printColorAdjust: 'exact' } as React.CSSProperties}>
                        <td colSpan={5} style={{
                          padding: '5px 10px',
                          fontWeight: '700',
                          textAlign: 'center',
                          fontSize: '8pt',
                          letterSpacing: '1px',
                          borderTop: '1px solid #ddd',
                        }}>
                          {session.description}
                        </td>
                      </tr>
                    )
                  }
                  return (
                    <tr key={session.id} style={{ backgroundColor: bg, printColorAdjust: 'exact' } as React.CSSProperties}>
                      <td style={{ padding: '4px 8px', borderTop: '1px solid #eee', whiteSpace: 'nowrap', fontSize: '8pt', fontWeight: '600' }}>
                        {session.computedStartTime ?? ''}
                      </td>
                      <td style={{ padding: '4px 8px', borderTop: '1px solid #eee', textAlign: 'center', fontSize: '8pt' }}>
                        {session.duration ?? ''}
                      </td>
                      <td style={{ padding: '4px 8px', borderTop: '1px solid #eee', fontSize: '8pt' }}>
                        {session.inCharge}
                      </td>
                      <td style={{ padding: '4px 8px', borderTop: '1px solid #eee', fontSize: '8pt', fontWeight: '500' }}>
                        {session.description}
                      </td>
                      <td style={{ padding: '4px 8px', borderTop: '1px solid #eee', fontSize: '8pt' }}>
                        {session.team !== 'none' ? TEAM_LABELS[session.team] : ''}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
