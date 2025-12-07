import { FocusMode } from '../interfaces';

export const defaultFocusModes: FocusMode[] = [
  {
    id: 'mode-1',
    name: 'Deep Work',
    focusTime: 45,
    relaxEnabled: true,
    relaxTime: 15,
    repeatEnabled: true,
  },
  {
    id: 'mode-2',
    name: 'Quick Focus',
    focusTime: 25,
    relaxEnabled: true,
    relaxTime: 5,
    repeatEnabled: true,
  },
  {
    id: 'mode-3',
    name: 'Extended Session',
    focusTime: 90,
    relaxEnabled: true,
    relaxTime: 20,
    repeatEnabled: false,
  },
];
