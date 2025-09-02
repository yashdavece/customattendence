export interface Subject {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  minAttendance: number;
  totalLectures: number;
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent';
  lectureNumber: number;
}

export interface AttendanceStats {
  subjectId: string;
  totalLectures: number;
  presentCount: number;
  absentCount: number;
  percentage: number;
  status: 'good' | 'warning' | 'critical';
}

export interface AppSettings {
  defaultMinAttendance: number;
  exportFormat: 'json' | 'csv';
}

export interface ExportData {
  subjects: Subject[];
  attendance: AttendanceRecord[];
  settings: AppSettings;
  exportDate: string;
}