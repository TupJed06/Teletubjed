// TypeScript interfaces and types for Teletubjed app

export interface FocusMode {
  _id: string;
  focusName: string;
  focusTime: number; // in minutes
  repeatOn: boolean;
  relaxTime: number; // in minutes
}

export interface HistoryLog {
  id: string;
  no: number;
  modeName: string;
  totalRound: number;
  focusTime: number; // in minutes
  relaxTime: number; // in minutes
  startTime: string;
  endTime: string;
  avgBrightness: number; // percentage
  avgTemperature: number;
  avgHumidity: number;
  focus: number; // percentage
}

export interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  currentMode: FocusMode | null;
  currentRound: number;
  totalSeconds: number;
  elapsedSeconds: number;
  isRelaxPhase: boolean;
  brightnessData: BrightnessPoint[];
}

export interface BrightnessPoint {
  timestamp: number;
  value: number;
}

export interface TimerSettings {
  focusTime: number;
  relaxTime: number;
  repeatEnabled: boolean;
}
