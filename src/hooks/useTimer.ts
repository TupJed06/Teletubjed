import { useState, useEffect, useCallback, useRef } from 'react';
import { minutesToSeconds } from '../utils/timeFormat';
import { BrightnessPoint } from '../interfaces';

interface UseTimerProps {
  focusTime: number; 
  relaxTime: number; 
  repeatEnabled: boolean;
  onComplete?: () => void;
}

export const useTimer = ({
  focusTime,
  relaxTime,
  repeatEnabled,
  onComplete,
}: UseTimerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isRelaxPhase, setIsRelaxPhase] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [brightnessData, setBrightnessData] = useState<BrightnessPoint[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = isRelaxPhase
    ? minutesToSeconds(relaxTime)
    : minutesToSeconds(focusTime);

  const remainingSeconds = totalSeconds - elapsedSeconds;

  // Helper: Generate Data
  const generateBrightnessPoint = useCallback(() => {
    const now = Date.now();
    const value = 50 + Math.random() * 40; 
    return { timestamp: now, value };
  }, []);

  // ----------------------------------------------------------------
  // 1. THE TICKER (Pure Time Counting)
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!isActive || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      
      // Data generation is safe here as it doesn't affect flow control
      if ((elapsedSeconds + 1) % 5 === 0) {
        setBrightnessData((data) => [...data, generateBrightnessPoint()]);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused, generateBrightnessPoint, elapsedSeconds]);

  // ----------------------------------------------------------------
  // 2. THE BRAIN (Phase Switching Logic)
  // This watches the time and decides when to switch. 
  // Since it's a useEffect, it won't double-fire in a way that breaks logic.
  // ----------------------------------------------------------------
  useEffect(() => {
    // Only check if we have actually reached the limit
    if (elapsedSeconds >= totalSeconds && totalSeconds > 0 && isActive) {
      
      // CASE 1: Relax Phase Finished
      if (isRelaxPhase) {
        if (repeatEnabled) {
          // Finish Relax -> Start Focus -> Next Round
          setCurrentRound((prev) => prev + 1);
          setIsRelaxPhase(false);
          setElapsedSeconds(0); // Reset timer
        } else {
          // Stop everything
          setIsActive(false);
          onComplete?.();
        }
      } 
      
      // CASE 2: Focus Phase Finished
      else {
        if (repeatEnabled) {
          // Finish Focus -> Start Relax (Same Round)
          setIsRelaxPhase(true);
          setElapsedSeconds(0); // Reset timer
        } else {
          // Stop everything
          setIsActive(false);
          onComplete?.();
        }
      }
    }
  }, [elapsedSeconds, totalSeconds, isRelaxPhase, repeatEnabled, isActive, onComplete]);


  // ----------------------------------------------------------------
  // Controls
  // ----------------------------------------------------------------
  const start = useCallback(() => { setIsActive(true); setIsPaused(false); }, []);
  const pause = useCallback(() => { setIsPaused(true); }, []);
  const resume = useCallback(() => { setIsPaused(false); }, []);
  
  const stop = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setCurrentRound(1);
    setIsRelaxPhase(false);
    setBrightnessData([]);
  }, []);

  const reset = useCallback(() => {
    setElapsedSeconds(0);
    setIsRelaxPhase(false);
  }, []);

  return {
    isActive,
    isPaused,
    currentRound,
    isRelaxPhase,
    elapsedSeconds,
    remainingSeconds,
    totalSeconds,
    brightnessData,
    progress: totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 100,
    start,
    pause,
    resume,
    stop,
    reset,
  };
};