import React from 'react';

export const TimelineRuler: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full h-12 border-b border-timeline-ruler flex items-end">
      <div className="flex-1 flex">
        {hours.map((hour) => (
          <div key={hour} className="flex-1 border-l border-timeline-ruler h-6 relative">
            <span className="absolute -left-3 -bottom-6 text-xs text-gray-500">
              {`${hour.toString().padStart(2, '0')}:00`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};