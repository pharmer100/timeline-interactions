import React from 'react';

export const TimelineRuler: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full h-16 border-b-2 border-black flex items-end">
      <div className="flex-1 flex">
        {hours.map((hour) => (
          <div key={hour} className="flex-1 border-l-2 border-black h-8 relative">
            <span className="absolute -left-3 -bottom-6 text-sm text-gray-700 font-medium">
              {`${hour.toString().padStart(2, '0')}:00`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};