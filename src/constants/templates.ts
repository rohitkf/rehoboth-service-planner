import type { Block, Session } from '../types'

function makeSession(partial: Omit<Session, 'id'>): Session {
  return { id: crypto.randomUUID(), ...partial }
}

function makeBlock(partial: Omit<Block, 'id'> & { sessions: Session[] }): Block {
  return { id: crypto.randomUUID(), ...partial }
}

export function createDefaultBlocks(): Block[] {
  return [
    makeBlock({
      name: 'PRE-SERVICE SETUP',
      startTime: '07:00',
      headerColor: '#1e3a5f',
      manualTimes: true,
      sessions: [
        makeSession({ isLabelRow: false, description: 'Call Time', duration: null, inCharge: 'Blesson', team: 'none', rowColor: '#ffffcc' }),
        makeSession({ isLabelRow: false, description: 'Build System (Refer Sheet for Checklists)', duration: null, inCharge: 'Blesson', team: 'audio', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Stage', duration: null, inCharge: 'Sandra', team: 'stage', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Vocals & Band Load', duration: null, inCharge: '', team: 'audioAndWorship', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'System Checks (Refer Sheet for Checklists)', duration: null, inCharge: '', team: 'audioAndWorship', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'MC Check', duration: 10, inCharge: '', team: 'audioAndWorship', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Sound Check – Band', duration: 10, inCharge: '', team: 'audioAndWorship', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Vocal Check', duration: 10, inCharge: '', team: 'audioAndWorship', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Rehearsal Service – Jobin, Rose, Joel', duration: 20, inCharge: '', team: 'audioAndWorship', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Rehearsal Service – Guest', duration: 20, inCharge: '', team: 'audioAndWorship', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Coffee Time', duration: 10, inCharge: '', team: 'none', rowColor: '#fff2cc' }),
        makeSession({ isLabelRow: false, description: 'AV Checks (Live Trial, Camera Setup, Verseview Setup)', duration: 50, inCharge: 'Rohit', team: 'video', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Service Briefing', duration: null, inCharge: 'Jolsna', team: 'none', rowColor: '#ffd966' }),
      ],
    }),
    makeBlock({
      name: 'ENGLISH SERVICE',
      startTime: '09:30',
      headerColor: '#1a4731',
      manualTimes: false,
      sessions: [
        makeSession({ isLabelRow: false, description: 'WL1', duration: 30, inCharge: 'Jobin', team: 'worship', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Intercessory', duration: 7, inCharge: 'Dariya', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Introduction', duration: 3, inCharge: 'Hefsiba', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Welcome', duration: 3, inCharge: 'Hefsiba', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Gospel Message', duration: 3, inCharge: 'Hefsiba', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Offerings | Announcements', duration: 3, inCharge: 'Hefsiba', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Message', duration: 45, inCharge: 'Shiney', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Conclusion | End Live', duration: 2, inCharge: 'Dani', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: true, description: 'Meet and Greet', duration: null, inCharge: '', team: 'none', rowColor: '#c6efce' }),
      ],
    }),
    makeBlock({
      name: 'MALAYALAM SERVICE',
      startTime: '11:30',
      headerColor: '#4a1942',
      manualTimes: false,
      sessions: [
        makeSession({ isLabelRow: false, description: 'WL1', duration: 25, inCharge: 'Binitha', team: 'worship', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Intercessory', duration: 10, inCharge: 'Ajison', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Welcome', duration: 5, inCharge: 'Anoop', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Introduction | Short Message', duration: 10, inCharge: 'Anoop', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Gospel Message', duration: 3, inCharge: 'Sumi', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Offering | Announcements', duration: 2, inCharge: 'Sumi', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'WL2', duration: 35, inCharge: 'Jobin', team: 'worship', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Deliverance Prayer', duration: 15, inCharge: 'Akash', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Message | Worship', duration: 50, inCharge: 'Ps Godlee Cherian', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Conclusion | End Live', duration: 5, inCharge: 'Rohit', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Kids Testimony', duration: 3, inCharge: 'Rohit', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: false, description: 'Prayer & Benediction', duration: 3, inCharge: 'Rohit', team: 'none', rowColor: '' }),
        makeSession({ isLabelRow: true, description: 'Meet & Greet', duration: null, inCharge: '', team: 'none', rowColor: '#c6efce' }),
      ],
    }),
    makeBlock({
      name: 'DEBRIEFING',
      startTime: '14:30',
      headerColor: '#1e3a5f',
      manualTimes: false,
      sessions: [
        makeSession({ isLabelRow: false, description: 'Debriefing with HODs & Pastors', duration: 30, inCharge: 'Jolsna', team: 'none', rowColor: '' }),
      ],
    }),
  ]
}
