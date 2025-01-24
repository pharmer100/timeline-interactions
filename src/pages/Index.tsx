import React, { useState } from 'react';
import { TimelineRuler } from '@/components/TimelineRuler';
import { TimelineLane } from '@/components/TimelineLane';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Timeline {
  id: string;
  name: string;
  events: Array<{
    id: string;
    title: string;
    time: string;
    description: string;
    type: string;
  }>;
}

const Index = () => {
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [newTimelineName, setNewTimelineName] = useState('');

  const addTimeline = () => {
    if (!newTimelineName.trim()) {
      toast.error('Please enter a timeline name');
      return;
    }
    
    setTimelines([
      ...timelines,
      {
        id: Math.random().toString(),
        name: newTimelineName,
        events: [],
      },
    ]);
    setNewTimelineName('');
    toast.success('Timeline added successfully');
  };

  const addEvent = (timelineId: string) => {
    setTimelines(
      timelines.map((timeline) => {
        if (timeline.id === timelineId) {
          return {
            ...timeline,
            events: [
              ...timeline.events,
              {
                id: Math.random().toString(),
                title: 'New Event',
                time: '12:00',
                description: 'Event description',
                type: 'Meeting',
              },
            ],
          };
        }
        return timeline;
      })
    );
    toast.success('Event added successfully');
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Timeline Visualization</h1>
        
        <div className="bg-white rounded-lg shadow-sm">
          <TimelineRuler />
          
          {timelines.map((timeline) => (
            <TimelineLane
              key={timeline.id}
              name={timeline.name}
              events={timeline.events}
              onAddEvent={() => addEvent(timeline.id)}
            />
          ))}
          
          <div className="p-4 flex items-center gap-4">
            <Input
              placeholder="Enter timeline name"
              value={newTimelineName}
              onChange={(e) => setNewTimelineName(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={addTimeline}>
              <Plus className="h-4 w-4 mr-1" />
              Add Timeline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;