export type GoalType = 'yearly' | 'quarterly' | 'monthly' | 'weekly' | 'habit';

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  status: GoalStatus;
  progress: number;
  startDate?: string;
  endDate?: string;
  tags: string[];
  notes: string;
  parentId?: string;
  children: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: "avatar" | "pomodoro" | "goals" | "schedule";
  position: {
    x: number;
    y: number;
  };
  size: {
    w: number;
    h: number;
  };
  content: any;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
}

export interface UserSettings {
  defaultLayout: string;
  theme: 'light' | 'dark' | 'system';
  layouts: DashboardLayout[];
}
