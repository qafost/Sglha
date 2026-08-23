export type AIIntent =
  | "conversation"
  | "create_note"
  | "list_notes"
  | "create_task"
  | "create_reminder";

export interface AITask {
  title: string;
}

export interface AINote {
  title: string;
  description: string;
}

export interface AIReminder {
  date: string;
  time: string;
}

export interface AIAnalysis {
  intent: AIIntent;

  reply: string;

  note?: AINote | null;

  tasks?: AITask[];

  reminder?: AIReminder | null;
}

export interface AIResponse extends AIAnalysis {
  note: AINote | null;

  tasks: AITask[];

  reminder: AIReminder | null;
}