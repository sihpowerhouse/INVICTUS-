import type { LucideIcon } from 'lucide-react';

/** Status of a department's operational state. */
export type DepartmentStatus = 'OPERATIONAL' | 'ELEVATED' | 'CRITICAL';

/** A single quick-action link within a department card. */
export interface DepartmentAction {
  label: string;
  icon: LucideIcon;
}

/** Core department data used across the application. */
export interface Department {
  /** Unique key, e.g. "POLICE", "FSL". */
  id: string;
  /** Human-readable department name. */
  title: string;
  /** Short role description. */
  description: string;
  /** Lucide icon component for the department. */
  icon: LucideIcon;
  /** Current operational status. */
  status: DepartmentStatus;
  /** Number of active items (cases, tasks, etc.). */
  activeWorkload: number;
  /** Key actions available within this department. */
  actions: DepartmentAction[];
}
