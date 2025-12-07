'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@/components/molecules/CircularProgress';
import { TimePicker } from '@/components/molecules/TimePicker';
import { Toggle } from '@/components/atoms/Toggle';
import { Button } from '@/components/atoms/Button';
import { useTimerContext } from '@/context/TimerContext';
import getFocus from '@/libs/Focus/getFocus';
import updateFocus from '@/libs/Focus/updateFocus';
import createHistory from '@/libs/History/createHistory';
import { database } from '@/libs/firebaseClient';
import { ref, onValue } from "firebase/database";

export default function HomePage() {
  const { setCurrentSettings } = useTimerContext();
  const router = useRouter();
  const ID = process.env.NEXT_PUBLIC_FRONTEND_FOCUS_ID || "";

  // ... (Settings State) ...
  const [settings, setSettings] = useState({
    _id: '',
    focusName: '',
    focusTime: 25,
    relaxTime: 5,
    repeatEnabled: false
  });
  const [loading, setLoading] = useState(true);

  // ... (Calibration State) ...
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [targetHistoryId, setTargetHistoryId] = useState<string | null>(null);

  // 1. FETCH SETTINGS
  useEffect(() => {
    const initData = async () => {
      try {
        if (!ID) return;
        const res = await getFocus(ID);
        if (res.success) {
          setSettings({
            _id: res.data._id,
            focusName: res.data.focusName,
            focusTime: res.data.focusTime,
            relaxTime: res.data.relaxTime,
            repeatEnabled: res.data.repeatOn
          });
          setCurrentSettings({
            focusTime: res.data.focusTime,
            relaxTime: res.data.relaxTime,
            repeatEnabled: res.data.repeatOn
          });
        }
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    initData();
  }, [ID, setCurrentSettings]);

  // ----------------------------------------------------------------
  // 2. LISTENER: Remote Start (From CAM) -> TRIGGERS COUNTDOWN
  // ----------------------------------------------------------------
  useEffect(() => {
    const sessionRef = ref(database, 'session_data');
    setTimeout(()=>{},1000)
    const unsubscribe = onValue(sessionRef, (snapshot) => {
      const val = snapshot.val();

      if (val && val.active_history_id && !isCalibrating && !targetHistoryId && val.command === "START" ) {
          setCurrentSettings({
            focusTime: val.timer_duration,
            relaxTime: val.relaxTime,
            repeatEnabled: val.relaxTime? true : false
          });
         if (val.status === "CALIBRATING") {
             setTargetHistoryId(val.active_history_id);
             setCountdown(10); 
             setIsCalibrating(true);
         }
         else if (val.status === "RUNNING") {
             router.push(`/started/${val.active_history_id}`);
         }
      }
    });
    return () => unsubscribe();
  }, [router, isCalibrating, targetHistoryId]);

  // 3. LOGIC: Auto-Save (Same as before)
  const handleSettingChange = async (field: string, value: any) => {
    const newSettings = { ...settings, [field]: value };
    await updateFocus(ID, { 
        focusTime: Number(newSettings.focusTime),
        relaxTime: newSettings.repeatEnabled ? Number(newSettings.relaxTime): 0,
        repeatOn: newSettings.repeatEnabled 
      });
    setSettings(newSettings);
    setCurrentSettings({
      focusTime: newSettings.focusTime,
      relaxTime: newSettings.relaxTime,
      repeatEnabled: newSettings.repeatEnabled
    });
    // ... updateFocus call ...
  };

  // 4. LOGIC: Manual Start
  const handleStart = async () => {
    try {
      const session = await createHistory({
        focusMode: ID,
        repeatOn: settings.repeatEnabled,
        focusTime: settings.focusTime,
        relaxTime: settings.relaxTime,
      });

      if (session.success) {
        setTargetHistoryId(session.data._id);
        setCountdown(10);
        setIsCalibrating(true);
      }
    } catch (error) {
      console.error("Failed to create history", error);
    }
  };

  // 5. LOGIC: The Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCalibrating && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isCalibrating && countdown === 0 && targetHistoryId) {
      router.push(`/started/${targetHistoryId}`);
    }
    return () => clearInterval(timer);
  }, [isCalibrating, countdown, targetHistoryId, router]);


  // --- RENDER ---

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  // A. CALIBRATION OVERLAY
  if (isCalibrating) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 text-white flex flex-col items-center justify-center">
        <div className="animate-pulse mb-8">
            <div className="h-32 w-32 rounded-full border-4 border-yellow-500 flex items-center justify-center">
                <span className="text-6xl font-bold">{countdown}</span>
            </div>
        </div>
        <h2 className="text-3xl font-bold text-yellow-400 mb-2">Calibrating Sensors...</h2>
        <p className="text-gray-400">Syncing with Board...</p>
      </div>
    );
  }

  // B. NORMAL UI
  return (
    <div className="container mx-auto px-6 py-12">
        {/* ... Your existing JSX for Settings/Buttons ... */}
         <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-blue-600 mb-2">Website</h1>
            <p className="text-gray-600">Mode: {settings.focusName}</p>
          </div>

          {/* Circular Progress Display */}
          <div className="flex justify-center mb-8">
            <CircularProgress progress={0} size={240} strokeWidth={16}>
              <div className="text-center">
                <div className="text-5xl mb-1">{settings.focusTime}</div>
                <div className="text-gray-500">minutes</div>
              </div>
            </CircularProgress>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            
            {/* Time Selector */}
            <div>
              <TimePicker
                label="Focus Duration"
                value={settings.focusTime}
                onChange={(val) => handleSettingChange('focusTime', val)}
                min={1}
                max={180}
              />
            </div>

            {/* Repeat Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="mb-1">Repeat Mode</div>
                <p className="text-sm text-gray-600">Automatically start next round</p>
              </div>
              <Toggle 
                checked={settings.repeatEnabled} 
                onChange={(val) => handleSettingChange('repeatEnabled', val)} 
              />
            </div>
          </div>

          {/* Relax Timer (Shown if Relax OR Repeat is On) */}
            {( settings.repeatEnabled) && (
              <div className="pl-4 border-l-4 border-blue-500 transition-all mt-4">
                <TimePicker
                  label="Relax Duration"
                  value={settings.relaxTime}
                  onChange={(val) => handleSettingChange('relaxTime', val)}
                  min={1}
                  max={60}
                />
              </div>
            )}

          {/* Start Button */}
          <div className="mt-8">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleStart}
            >
              Start Focus Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}