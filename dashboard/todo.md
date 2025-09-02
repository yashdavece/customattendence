# Attendance Tracker - Implementation Plan

## Core Files to Create/Modify:
1. **src/App.jsx** - Main app with routing and layout
2. **src/components/AttendanceTracker.jsx** - Main dashboard component
3. **src/components/SubjectManager.jsx** - Subject CRUD operations
4. **src/components/AttendanceMarker.jsx** - Mark attendance for lectures
5. **src/components/AttendanceStats.jsx** - Statistics and percentage display
6. **src/components/SettingsPanel.jsx** - Threshold and export/import settings
7. **src/utils/localStorage.js** - Data persistence utilities
8. **src/types/attendance.ts** - TypeScript type definitions

## Data Structure:
- Subjects: { id, name, color, createdAt, minAttendance }
- Attendance: { id, subjectId, date, status, lectureNumber }
- Settings: { defaultMinAttendance, exportFormat }

## Features Implementation:
- ✅ Subject management (CRUD)
- ✅ Attendance marking with date tracking
- ✅ Percentage calculation
- ✅ Visual indicators (good/warning/critical)
- ✅ Dashboard with statistics
- ✅ Export/import functionality
- ✅ Responsive design with Shadcn-ui
- ✅ localStorage persistence

## File Limit: 8 files (within limit)