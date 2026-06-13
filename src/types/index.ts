export type TeamKey = 'audio' | 'stage' | 'video' | 'audioAndWorship' | 'worship' | 'none';
export type UserRole = 'admin' | 'volunteer';

export interface Session {
  id: string;
  isLabelRow: boolean;
  description: string;
  duration: number | null;
  inCharge: string;
  team: TeamKey;
  rowColor?: string;
}

export interface Block {
  id: string;
  name: string;
  startTime: string;
  headerColor: string;
  manualTimes: boolean;
  sessions: Session[];
}

export interface PlanData {
  blocks: Block[];
}

export interface ServicePlan {
  id: string;
  date: string;
  plan_data: PlanData;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export interface ComputedSession extends Session {
  computedStartTime: string | null;
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
