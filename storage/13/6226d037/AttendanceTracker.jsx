import React, { useState, useEffect } from 'react';
import { BookOpen, BarChart3, Settings, Users } from 'lucide-react';
import SubjectManager from './SubjectManager';
import AttendanceMarker from './AttendanceMarker';
import AttendanceStats from './AttendanceStats';
import SettingsPanel from './SettingsPanel';
import {
  getSubjects,
  saveSubjects,
  getAttendanceRecords,
  saveAttendanceRecords,
  getSettings,
  saveSettings,
  calculateAttendanceStats
} from '../utils/localStorage';

const AttendanceTracker = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subjects, setSubjects] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [settings, setSettings] = useState({});
  const [stats, setStats] = useState([]);

  // Load data on component mount
  useEffect(() => {
    const loadedSubjects = getSubjects();
    const loadedRecords = getAttendanceRecords();
    const loadedSettings = getSettings();

    setSubjects(loadedSubjects);
    setAttendanceRecords(loadedRecords);
    setSettings(loadedSettings);
  }, []);

  // Recalculate stats when subjects or attendance records change
  useEffect(() => {
    const calculatedStats = calculateAttendanceStats(subjects, attendanceRecords);
    setStats(calculatedStats);
  }, [subjects, attendanceRecords]);

  const handleSubjectsChange = (newSubjects) => {
    setSubjects(newSubjects);
    saveSubjects(newSubjects);
  };

  const handleAttendanceChange = (newRecords) => {
    setAttendanceRecords(newRecords);
    saveAttendanceRecords(newRecords);
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleDataImport = (importedData) => {
    setSubjects(importedData.subjects);
    setAttendanceRecords(importedData.attendance);
    setSettings(importedData.settings);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'subjects', label: 'Subjects', icon: Users },
    { id: 'attendance', label: 'Mark Attendance', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Attendance Tracker
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              {subjects.length} subjects • {attendanceRecords.length} records
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <AttendanceStats
            stats={stats}
            subjects={subjects}
            attendanceRecords={attendanceRecords}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectManager
            subjects={subjects}
            onSubjectsChange={handleSubjectsChange}
            settings={settings}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceMarker
            subjects={subjects}
            attendanceRecords={attendanceRecords}
            onAttendanceChange={handleAttendanceChange}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onDataImport={handleDataImport}
          />
        )}
      </div>
    </div>
  );
};

export default AttendanceTracker;