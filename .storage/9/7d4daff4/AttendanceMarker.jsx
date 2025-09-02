import React, { useState } from 'react';
import { Check, X, Calendar, Clock } from 'lucide-react';
import { generateId } from '../utils/localStorage';

const AttendanceMarker = ({ subjects, attendanceRecords, onAttendanceChange }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getNextLectureNumber = (subjectId) => {
    const subjectRecords = attendanceRecords.filter(record => record.subjectId === subjectId);
    return subjectRecords.length + 1;
  };

  const getTodayRecords = () => {
    return attendanceRecords.filter(record => record.date === selectedDate);
  };

  const hasRecordForSubject = (subjectId) => {
    return getTodayRecords().some(record => record.subjectId === subjectId);
  };

  const markAttendance = (subjectId, status) => {
    const existingRecord = attendanceRecords.find(
      record => record.subjectId === subjectId && record.date === selectedDate
    );

    if (existingRecord) {
      // Update existing record
      const updatedRecords = attendanceRecords.map(record =>
        record.id === existingRecord.id
          ? { ...record, status }
          : record
      );
      onAttendanceChange(updatedRecords);
    } else {
      // Create new record
      const newRecord = {
        id: generateId(),
        subjectId,
        date: selectedDate,
        status,
        lectureNumber: getNextLectureNumber(subjectId)
      };
      onAttendanceChange([...attendanceRecords, newRecord]);
    }
  };

  const getRecordStatus = (subjectId) => {
    const record = attendanceRecords.find(
      record => record.subjectId === subjectId && record.date === selectedDate
    );
    return record?.status;
  };

  const deleteRecord = (subjectId) => {
    const updatedRecords = attendanceRecords.filter(
      record => !(record.subjectId === subjectId && record.date === selectedDate)
    );
    onAttendanceChange(updatedRecords);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Mark Attendance</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No subjects available. Please add subjects first.
        </div>
      ) : (
        <div className="space-y-4">
          {subjects.map(subject => {
            const recordStatus = getRecordStatus(subject.id);
            const lectureNumber = getNextLectureNumber(subject.id);
            
            return (
              <div
                key={subject.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{subject.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Lecture #{recordStatus ? lectureNumber - 1 : lectureNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {recordStatus ? (
                    <>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        recordStatus === 'present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {recordStatus === 'present' ? 'Present' : 'Absent'}
                      </div>
                      <button
                        onClick={() => deleteRecord(subject.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove record"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => markAttendance(subject.id, 'present')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(subject.id, 'absent')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Absent
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {getTodayRecords().length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Today's Summary</h3>
          <p className="text-sm text-blue-700">
            {getTodayRecords().length} lecture(s) recorded for {selectedDate}
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceMarker;