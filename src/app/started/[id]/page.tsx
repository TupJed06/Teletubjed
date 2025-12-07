'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@/components/molecules/CircularProgress';
import { Button } from '@/components/atoms/Button';
import { Modal } from '@/components/molecules/Modal';
import { useTimerContext } from '@/context/TimerContext';
import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/utils/timeFormat';
import { database } from '@/libs/firebaseClient';
import { ref, onValue } from "firebase/database";
import stopSession from '@/libs/History/stopSession'; 
import updateHistory from '@/libs/History/updateHistory';

export default function StartedPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { currentSettings } = useTimerContext();
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("IDLE");
  const [data, setData] = useState<any>({ sensors: {}, average: {} });
  const [loading, setLoading] = useState(true);

  const {
    isActive,
    currentRound,
    isRelaxPhase,
    remainingSeconds,
    totalSeconds,
    progress,
    start,
    stop,
  } = useTimer({
    focusTime: currentSettings.focusTime,
    relaxTime: currentSettings.relaxTime,
    repeatEnabled: currentSettings.repeatEnabled,
    onComplete: () => handleAutoStop(), 
  });

  useEffect(() => {
    const sensorsRef = ref(database, 'session_data');
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(val);
        setStatus(val.status);
        
        if (val.command === 'STOP') {
          handleManualStop();
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (status === "RUNNING") {
      start();
    }
  }, [status, start]);

  const handleAutoStop = async () => {
    const payload = {
      focusTime: currentSettings.focusTime,
      relaxTime: 0,
      totalRound: 1,
    };

    await updateHistory(params.id);
    await stopSession(params.id, payload);
    router.push('/');
  };

  const handleManualStop = async () => {
    stop(); 
    await updateHistory(params.id);
    const his = await stopSession(params.id, {});
    console.log("Stop Session Response:", his);
    setShowModal(false);
    router.push('/');
  };

  const handleStopClick = () => {
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <h3 className="text-blue-600 mb-6">
                {isRelaxPhase ? 'Relax Time' : 'Focus Mode'}
              </h3>
              
              <div className="flex justify-center mb-6">
                <CircularProgress progress={progress} size={240} strokeWidth={16}>
                  <div className="text-center">
                    <div className="text-5xl mb-1">
                      {formatTime(remainingSeconds)}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {isRelaxPhase ? 'Relax' : 'Focus'}
                    </div>
                  </div>
                </CircularProgress>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Current Round:</span>
                  <span className="text-blue-600">Round {currentRound}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Status:</span>
                  <span className={isActive ? 'text-green-600' : 'text-gray-600'}>
                    {isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
             <div className="flex items-center justify-center bg-gray-100 rounded-3xl h-full min-h-[300px]">
                <h1 className="text-xl animate-pulse text-gray-400">Connecting to IoT...</h1>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl shadow-lg bg-white border-l-4 border-red-500 flex flex-col items-center justify-center">
                <h2 className="text-red-400 text-sm uppercase tracking-widest mb-2">Temperature</h2>
                <div className="text-5xl font-bold text-red-400">
                  {data.sensors && data.sensors.temp ? Math.round(data.sensors.temp) : "--"}
                  <span className="text-2xl text-gray-400 ml-1">°C</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl shadow-lg bg-white border-l-4 border-blue-500 flex flex-col items-center justify-center">
                <h2 className="text-blue-400 text-sm uppercase tracking-widest mb-2">Humidity</h2>
                <div className="text-5xl font-bold text-blue-400">
                  {data.sensors && data.sensors.humidity ? Math.round(data.sensors.humidity) : "--"}
                  <span className="text-2xl text-gray-400 ml-1">%</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl shadow-lg bg-white border-l-4 border-yellow-500 flex flex-col items-center justify-center">
                <h2 className="text-yellow-400 text-sm uppercase tracking-widest mb-2">Light</h2>
                <div className="text-5xl font-bold text-yellow-400">
                  {data.sensors && data.sensors.light ? Math.round(data.sensors.light) : "--"}
                  <span className="text-2xl text-gray-400 ml-1">%</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl shadow-lg bg-white border-l-4 border-green-500 flex flex-col items-center justify-center">
                <h2 className="text-green-400 text-sm uppercase tracking-widest mb-2">Focus Status</h2>
                {data.focus_status?.toLowerCase() === "on" ? (
                  <div className="text-3xl font-bold text-green-500">Good boy</div>
                ) : (
                  <div className="text-3xl font-bold text-red-500">Pls Focus!</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600 text-center">
              Stay focused! You can stop the session at any time.
            </p>
            <Button
              variant="danger"
              size="lg"
              onClick={handleStopClick}
              className="min-w-64"
            >
              Stop Session
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleManualStop} 
        title="Stop Focus Session?"
        message="Are you sure you want to stop? We will save your progress so far."
        confirmText="Stop & Save"
        cancelText="Continue"
      />
    </div>
  );
}