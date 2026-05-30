/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PoEStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  READY_FOR_ASSESSMENT = "Ready for Assessment",
  CERTIFIED = "Certified",
}

export enum CompetenceStatus {
  COMPETENT = "Competent",
  NOT_YET_COMPETENT = "Not Yet Competent",
  ONGOING = "Ongoing",
}

export interface AssessmentRecord {
  id: string;
  title: string;
  type: "CAT" | "Practical Project" | "Continuous Assessment" | "Internal Exam" | "External Assessment";
  obtainedScore: number; // percentage
  weight: number; // weight of total assessment (e.g., 40 for internal, 60 for external)
  date: string;
  feedback?: string;
  status: CompetenceStatus;
}

export interface UnitOfLearning {
  id: string;
  code: string;
  name: string;
  level: number; // Level 4, 5, or 6
  creditHours: number;
  hoursRequired: number;
  hoursAttended: number;
  poeStatus: PoEStatus;
  assessments: AssessmentRecord[];
  competenceStatus: CompetenceStatus;
}

export interface StudentProfile {
  name: string;
  admissionNo: string;
  courseName: string;
  institution: string;
  cohort: string;
  photoUrl?: string;
  email?: string;
}

export interface Deadline {
  id: string;
  unitId: string;
  unitName: string;
  title: string;
  dueDate: string;
  type: "PoE Submission" | "Practical Prep" | "Internal CAT" | "Institutional Exam" | "CDACC National Exam";
  description: string;
  completed: boolean;
  reminded?: boolean;
}

export interface CDACCDashboardData {
  student: StudentProfile;
  units: UnitOfLearning[];
  deadlines: Deadline[];
  attendanceLogs?: AttendanceSession[];
}

export interface AttendanceSession {
  id: string;
  unitId: string;
  unitName: string;
  unitCode: string;
  date: string;
  duration: number; // in hours
  status: "Present" | "Absent (Excused)" | "Absent (Unexcused)";
  remarks: string;
}
