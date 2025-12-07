'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@component/atoms/Input';
import { Toggle } from '@component/atoms/Toggle';
import { Button } from '@component/atoms/Button';
import { TimePicker } from '@component/molecules/TimePicker';
import { FocusMode } from '@interfaces/index'; 

import getFocuses from '@/libs/Focus/getFocuses';
import getFocus from '@/libs/Focus/getFocus';
import updateFocus from '@/libs/Focus/updateFocus';

export default function SettingsPage() {

  const [focusModes, setFocusModes] = useState<FocusMode[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedModeId, setSelectedModeId] = useState<string>('');
  const [editForm, setEditForm] = useState<FocusMode | null>(null);

  // 1. FETCH ALL MODES (Using getFocuses Lib)

  const fetchFocusModes = async () => {
    try {
  
      const response = await getFocuses();
      
      if (response.success) {
        setFocusModes(response.data);
      
        if (!selectedModeId && response.data.length > 0) {
          handleSelectMode(response.data[0]._id);
        }
      } else {
        console.error("Failed to load list:", response.message);
      }
    } catch (error) {
      console.error("Error fetching modes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFocusModes();
  }, []);

  // 2. SELECT MODE (Using getFocus Lib)-
  const handleSelectMode = async (id: string) => {
    setSelectedModeId(id);
    
    try {
  
      const response = await getFocus(id);

      if (response.success) {
        setEditForm(response.data);
      } else {
        console.error("Failed to load mode details");
      }
    } catch (error) {
      console.error("Error calling getFocus:", error);
    }
  };

  // 3. SAVE CHANGES (Using updateFocus Lib)
 
  const handleSave = async () => {
    if (!editForm) return;

    try {
      const response = await updateFocus(editForm._id, {
        focusName: editForm.focusName,
        focusTime: editForm.focusTime,
        relaxTime: editForm.relaxTime,
        repeatOn: editForm.repeatOn
      });

      if (response.success) {

        fetchFocusModes(); 
        alert('updated successfully');
      } else {
        alert('Failed to save: ' + response.message);
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert('Error saving data');
    }
  };

  const handleCancel = () => {
    if (selectedModeId) {
      handleSelectMode(selectedModeId);
    }
  };

  const handleFormChange = (field: keyof FocusMode, value: any) => {
    if (editForm) {
      if (field === 'focusTime' || field === 'relaxTime') {
        value = Number(value); 
      }
      setEditForm({ ...editForm, [field]: value });
    }
  };

  if (loading) return <div className="p-10 text-center">Loading settings...</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold">Focus Mode Settings</h1>
          <p className="text-gray-600">Customize your focus mode presets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="mb-4 font-semibold text-lg">Focus Modes</h3>
              <div className="space-y-2">
                {focusModes.map((mode) => (
                  <button
                    key={mode._id}
                    onClick={() => handleSelectMode(mode._id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedModeId === mode._id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{mode.focusName}</div>
                    <div className={`text-sm ${
                      selectedModeId === mode._id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {mode.focusTime} min focus
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* EDIT FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {editForm ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-6 text-xl font-bold">Edit Mode: {editForm.focusName}</h2>
                  </div>

                  {/* Mode Name */}
                  <div>
                    <Input
                      label="Mode Name"
                      value={editForm.focusName}
                      onChange={(e: any) => handleFormChange('focusName', e.target.value)}
                      placeholder="Enter mode name"
                    />
                  </div>

                  {/* Focus Time */}
                  <div>
                    <TimePicker
                      label="Focus Duration"
                      value={editForm.focusTime}
                      onChange={(value: number) => handleFormChange('focusTime', value)}
                      min={1}
                      max={180}
                    />
                  </div>


                  {/* Repeat Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="mb-1 font-medium">Repeat Mode</div>
                      <p className="text-sm text-gray-600">Automatically start next round</p>
                    </div>
                    <Toggle
                      checked={editForm.repeatOn}
                      onChange={(value: boolean) => handleFormChange('repeatOn', value)}
                    />
                  </div>
                  
                  {/* Relax Duration  */}
                  {(editForm.repeatOn) && (
                    <div className="pl-4 border-l-4 border-blue-500 transition-all">
                      <TimePicker
                        label="Relax Duration"
                        value={editForm.relaxTime}
                        onChange={(value: number) => handleFormChange('relaxTime', value)}
                        min={1}
                        max={60}
                      />
                      {editForm.repeatOn && !editForm.repeatOn && (
                        <p className="text-xs text-blue-600 mt-2">
                          * Breaks are recommended when Repeat is on.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <Button variant="secondary" onClick={handleCancel} className="flex-1">
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} className="flex-1">
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  Select a focus mode to edit
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}