'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollableTimePickerProps {
  isOpen: boolean;
  onClose: () => void;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  title?: string;
  subtitle?: string;
}

export const ScrollableTimePicker: React.FC<ScrollableTimePickerProps> = ({
  isOpen,
  onClose,
  value,
  onChange,
  min = 1,
  max = 180,
  title = 'Select Duration',
  subtitle = 'Scroll to choose how long you want to focus',
}) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 60; // Height of each item
  const visibleItems = 5; // Number of visible items

  // Generate array of values
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      // Scroll to the selected value when opening
      const index = values.indexOf(value);
      if (index !== -1) {
        const scrollPosition = index * itemHeight;
        scrollContainerRef.current.scrollTop = scrollPosition;
        setSelectedValue(value);
      }

      // Hide scrollbar for webkit browsers
      const style = document.createElement('style');
      style.textContent = `
        .scroll-picker-container::-webkit-scrollbar {
          display: none;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isOpen, value]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      const index = Math.round(scrollTop / itemHeight);
      const newValue = values[index];
      if (newValue !== undefined && newValue !== selectedValue) {
        setSelectedValue(newValue);
      }
    }
  };

  const handleOk = () => {
    onChange(selectedValue);
    onClose();
  };

  const handleCancel = () => {
    setSelectedValue(value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>

        {/* Scrollable picker */}
        <div className="relative mb-6">
          {/* Selection indicator */}
          <div
            className="absolute left-0 right-0 pointer-events-none z-10"
            style={{
              top: `${(visibleItems - 1) / 2 * itemHeight}px`,
              height: `${itemHeight}px`,
              borderTop: '2px solid rgba(59, 130, 246, 0.5)',
              borderBottom: '2px solid rgba(59, 130, 246, 0.5)',
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
            }}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              min
            </div>
          </div>

          {/* Fade gradients */}
          <div
            className="absolute left-0 right-0 top-0 h-24 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(to bottom, rgb(255, 255, 255) 0%, transparent 100%)',
            }}
          />
          <div
            className="absolute left-0 right-0 bottom-0 h-24 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(to top, rgb(255, 255, 255) 0%, transparent 100%)',
            }}
          />

          {/* Scroll container */}
          <div
            ref={scrollContainerRef}
            className="overflow-y-scroll scroll-picker-container"
            style={{
              height: `${visibleItems * itemHeight}px`,
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
            onScroll={handleScroll}
          >
            {/* Top padding */}
            <div style={{ height: `${((visibleItems - 1) / 2) * itemHeight}px` }} />

            {/* Values */}
            {values.map((val) => {
              const isSelected = val === selectedValue;
              return (
                <div
                  key={val}
                  className="flex items-center justify-center transition-all duration-200"
                  style={{
                    height: `${itemHeight}px`,
                    fontSize: isSelected ? '2rem' : '1.5rem',
                    color: isSelected ? '#1f2937' : '#9ca3af',
                    opacity: isSelected ? 1 : 0.5,
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {val}
                </div>
              );
            })}

            {/* Bottom padding */}
            <div style={{ height: `${((visibleItems - 1) / 2) * itemHeight}px` }} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleOk}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
