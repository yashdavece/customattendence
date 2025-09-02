const STORAGE_KEYS = {
  SUBJECTS: 'attendance_subjects',
  ATTENDANCE: 'attendance_records',
  SETTINGS: 'attendance_settings'
};

// Default settings
const DEFAULT_SETTINGS = {
  defaultMinAttendance: 75,
  exportFormat: 'json'
};

// Subjects
export const getSubjects = () => {
  try {
    const subjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return subjects ? JSON.parse(subjects) : [];
  } catch (error) {
    console.error('Error loading subjects:', error);
    return [];
  }
};

export const saveSubjects = (subjects) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  } catch (error) {
    console.error('Error saving subjects:', error);
  }
};

// Attendance Records
export const getAttendanceRecords = () => {
  try {
    const records = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error('Error loading attendance records:', error);
    return [];
  }
};

export const saveAttendanceRecords = (records) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving attendance records:', error);
  }
};

// Settings
export const getSettings = () => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Utility functions
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateAttendanceStats = (subjects, attendanceRecords) => {
  return subjects.map(subject => {
    const subjectRecords = attendanceRecords.filter(record => record.subjectId === subject.id);
    const totalLectures = subjectRecords.length;
    const presentCount = subjectRecords.filter(record => record.status === 'present').length;
    const absentCount = totalLectures - presentCount;
    const percentage = totalLectures > 0 ? (presentCount / totalLectures) * 100 : 0;
    
    let status = 'good';
    if (percentage < subject.minAttendance - 10) {
      status = 'critical';
    } else if (percentage < subject.minAttendance) {
      status = 'warning';
    }
    
    return {
      subjectId: subject.id,
      subjectName: subject.name,
      subjectColor: subject.color,
      totalLectures,
      presentCount,
      absentCount,
      percentage: Math.round(percentage * 100) / 100,
      status,
      minAttendance: subject.minAttendance
    };
  });
};

// Export/Import functions
export const exportData = () => {
  const data = {
    subjects: getSubjects(),
    attendance: getAttendanceRecords(),
    settings: getSettings(),
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.subjects && data.attendance && data.settings) {
          saveSubjects(data.subjects);
          saveAttendanceRecords(data.attendance);
          saveSettings(data.settings);
          resolve(data);
        } else {
          reject(new Error('Invalid backup file format'));
        }
      } catch (error) {
        reject(new Error('Failed to parse backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};