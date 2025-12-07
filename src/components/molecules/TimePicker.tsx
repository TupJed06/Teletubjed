'use client';

import React, { useState } from 'react';
import { ScrollableTimePicker } from './ScrollableTimePicker';

interface TimePickerProps {
  value: number; // in minutes
  onChange: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  min = 1,
  max = 180,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-2">
        {label && <label className="text-gray-700">{label}</label>}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors"
          >
            {value}
          </button>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
            min
          </span>
        </div>
        <span className="text-xs text-gray-500">Max {max} minutes</span>
      </div>

      <ScrollableTimePicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
      />
    </>
  );
};
