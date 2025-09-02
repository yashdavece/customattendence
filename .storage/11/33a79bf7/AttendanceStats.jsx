import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Users, Calendar } from 'lucide-react';

const AttendanceStats = ({ stats, subjects, attendanceRecords }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'critical':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getProgressBarColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const overallStats = {
    totalSubjects: subjects.length,
    totalLectures: attendanceRecords.length,
    totalPresent: attendanceRecords.filter(r => r.status === 'present').length,
    overallPercentage: attendanceRecords.length > 0 
      ? (attendanceRecords.filter(r => r.status === 'present').length / attendanceRecords.length) * 100 
      : 0
  };

  const criticalSubjects = stats.filter(stat => stat.status === 'critical').length;
  const warningSubjects = stats.filter(stat => stat.status === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{overallStats.totalSubjects}</div>
            <div className="text-sm text-blue-700">Total Subjects</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{overallStats.totalLectures}</div>
            <div className="text-sm text-green-700">Total Lectures</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">{overallStats.totalPresent}</div>
            <div className="text-sm text-purple-700">Present</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-indigo-900">
              {Math.round(overallStats.overallPercentage)}%
            </div>
            <div className="text-sm text-indigo-700">Overall %</div>
          </div>
        </div>

        {(criticalSubjects > 0 || warningSubjects > 0) && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Attention Required</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              {criticalSubjects > 0 && `${criticalSubjects} subject(s) have critical attendance. `}
              {warningSubjects > 0 && `${warningSubjects} subject(s) need attention.`}
            </p>
          </div>
        )}
      </div>

      {/* Subject-wise Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject-wise Attendance</h2>
        
        {stats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No attendance data available. Start marking attendance to see statistics.
          </div>
        ) : (
          <div className="space-y-4">
            {stats.map(stat => (
              <div
                key={stat.subjectId}
                className={`p-4 border rounded-lg ${getStatusColor(stat.status)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stat.subjectColor }}
                    />
                    <h3 className="font-medium text-gray-900">{stat.subjectName}</h3>
                    {getStatusIcon(stat.status)}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.percentage}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.presentCount}/{stat.totalLectures} lectures
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>Target: {stat.minAttendance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressBarColor(stat.status)}`}
                      style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                    />
                  </div>
                  {/* Target line */}
                  <div className="relative">
                    <div
                      className="absolute top-[-8px] w-0.5 h-4 bg-gray-600"
                      style={{ left: `${stat.minAttendance}%` }}
                    />
                  </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{stat.presentCount}</div>
                    <div className="text-gray-600">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">{stat.absentCount}</div>
                    <div className="text-gray-600">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{stat.totalLectures}</div>
                    <div className="text-gray-600">Total</div>
                  </div>
                </div>

                {/* Status Message */}
                {stat.status === 'critical' && (
                  <div className="mt-3 text-sm text-red-700">
                    ⚠️ Critical: {(stat.minAttendance - stat.percentage).toFixed(1)}% below target
                  </div>
                )}
                {stat.status === 'warning' && (
                  <div className="mt-3 text-sm text-yellow-700">
                    ⚠️ Warning: Close to minimum attendance threshold
                  </div>
                )}
                {stat.status === 'good' && (
                  <div className="mt-3 text-sm text-green-700">
                    ✅ Good: Above minimum attendance requirement
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceStats;