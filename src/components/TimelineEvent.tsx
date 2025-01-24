import React from 'react';
import { Card } from '@/components/ui/card';

interface TimelineEventProps {
  title: string;
  time: string;
  description: string;
  type: string;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  title,
  time,
  description,
  type,
}) => {
  return (
    <Card className="w-64 p-4 shadow-md bg-timeline-event animate-fade-in">
      <div className="text-sm text-gray-500">{time}</div>
      <h3 className="font-semibold mt-1">{title}</h3>
      <div className="text-sm mt-2">{description}</div>
      <div className="text-xs text-primary mt-2 font-medium">{type}</div>
    </Card>
  );
};