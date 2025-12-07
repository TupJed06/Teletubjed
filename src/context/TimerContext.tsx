'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { FocusMode, TimerSettings } from "../interfaces";
import { defaultFocusModes } from "../data/focusModes";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface TimerContextType {
  currentSettings: TimerSettings;
  setCurrentSettings: (settings: TimerSettings) => void;
  focusModes: FocusMode[];
  setFocusModes: (modes: FocusMode[]) => void;
  selectedMode: FocusMode | null;
  setSelectedMode: (mode: FocusMode | null) => void;
  updateFocusMode: (
    modeId: string,
    updates: Partial<FocusMode>,
  ) => void;
}

const TimerContext = createContext<
  TimerContextType | undefined
>(undefined);

export const TimerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const localStorageResult = useLocalStorage<FocusMode[]>(
    "teletubjed-focus-modes",
    defaultFocusModes,
  );
  const focusModes = localStorageResult[0];
  const setFocusModes = localStorageResult[1];

  const [currentSettings, setCurrentSettings] =
    useState<TimerSettings>({
      focusTime: 1,
      relaxTime: 1,
      repeatEnabled: true,
    });

  const [selectedMode, setSelectedMode] =
    useState<FocusMode | null>(null);

  const updateFocusMode = useCallback(
    (modeId: string, updates: Partial<FocusMode>) => {
      setFocusModes((modes) =>
        modes.map((mode) =>
          mode._id === modeId ? { ...mode, ...updates } : mode,
        ),
      );
    },
    [setFocusModes],
  );

  return (
    <TimerContext.Provider
      value={{
        currentSettings,
        setCurrentSettings,
        focusModes,
        setFocusModes,
        selectedMode,
        setSelectedMode,
        updateFocusMode,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error(
      "useTimerContext must be used within a TimerProvider",
    );
  }
  return context;
};