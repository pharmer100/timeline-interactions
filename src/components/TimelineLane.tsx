import React from 'react';
import { TimelineEvent } from './TimelineEvent';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Draggable from 'react-draggable';

interface Event {
  id: string;
  title: string;
  time: string;
  description: string;
  type: string;
}

interface TimelineLaneProps {
  name: string;
  events: Event[];
  onAddEvent: () => void;
}

export const TimelineLane: React.FC<TimelineLaneProps> = ({
  name,
  events,
  onAddEvent,
}) => {
  return (
    <div className="min-h-[200px] relative">
      <div className="absolute left-4 top-4 flex items-center gap-4">
        <h3 className="font-semibold">{name}</h3>
        <Button variant="outline" size="sm" onClick={onAddEvent}>
          <Plus className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </div>
      
      {/* Timeline ruler line */}
      <div className="absolute left-0 right-0 top-[4.5rem] h-[2px] bg-black"></div>
      
      <div className="pt-16 mt-16 px-4 flex gap-4">
        {events.map((event) => (
          <Draggable
            key={event.id}
            bounds="parent"
            defaultPosition={{x: 0, y: -32}} // Adjusted to align with middle of timeline
            grid={[20, 20]}
          >
            <div>
              <TimelineEvent
                title={event.title}
                time={event.time}
                description={event.description}
                type={event.type}
              />
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};