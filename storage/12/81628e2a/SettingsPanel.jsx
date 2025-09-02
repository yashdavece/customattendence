import React, { useState } from 'react';
import { Settings, Download, Upload, Save } from 'lucide-react';
import { exportData, importData } from '../utils/localStorage';

const SettingsPanel = ({ settings, onSettingsChange, onDataImport }) => {
  const [formData, setFormData] = useState(settings);
  const [importing, setImporting] = useState(false);

  const handleSave = () => {
    onSettingsChange(formData);
  };

  const handleExport = () => {
    exportData();
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    try {
      const data = await importData(file);
      onDataImport(data);
      alert('Data imported successfully!');
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    } finally {
      setImporting(false);
      event.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Minimum Attendance (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.defaultMinAttendance}
                onChange={(e) => setFormData({
                  ...formData,
                  defaultMinAttendance: parseInt(e.target.value) || 75
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                This will be the default minimum attendance for new subjects
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <select
                value={formData.exportFormat}
                onChange={(e) => setFormData({
                  ...formData,
                  exportFormat: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV (Coming Soon)</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Backup & Restore</h4>
              <p className="text-sm text-gray-600 mb-4">
                Export your data for backup or import from a previous backup file.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </button>
                
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {importing ? 'Importing...' : 'Import Data'}
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    disabled={importing}
                  />
                </label>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important Notes</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Importing data will replace all current data</li>
                <li>• Make sure to export your current data before importing</li>
                <li>• Only import files that were exported from this application</li>
                <li>• Data is stored locally in your browser</li>
              </ul>
            </div>
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Attendance Tracker v1.0</h4>
            <p className="text-sm text-gray-600 mb-2">
              A comprehensive attendance tracking application for students and educators.
            </p>
            <div className="text-sm text-gray-500">
              <p>Features:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Subject management with custom colors</li>
                <li>Date-wise attendance tracking</li>
                <li>Percentage calculation and visual indicators</li>
                <li>Export/import functionality</li>
                <li>Responsive design</li>
                <li>Local data storage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;