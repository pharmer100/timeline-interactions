import React, { useState } from 'react';
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

interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceAnchor: string;
  targetAnchor: string;
  type: string;
}

interface TimelineLaneProps {
  name: string;
  events: Event[];
  onAddEvent: () => void;
  onUpdateEvent: (eventId: string, data: Partial<Event>) => void;
}

export const TimelineLane: React.FC<TimelineLaneProps> = ({
  name,
  events,
  onAddEvent,
  onUpdateEvent,
}) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeConnection, setActiveConnection] = useState<Partial<Connection> | null>(null);

  const handleConnectionStart = (eventId: string, anchorPosition: string, connectionType: string) => {
    setActiveConnection({
      sourceId: eventId,
      sourceAnchor: anchorPosition,
      type: connectionType,
    });
  };

  const handleConnectionEnd = (eventId: string, anchorPosition: string) => {
    if (activeConnection && activeConnection.sourceId !== eventId) {
      const newConnection: Connection = {
        id: Math.random().toString(),
        sourceId: activeConnection.sourceId!,
        targetId: eventId,
        sourceAnchor: activeConnection.sourceAnchor!,
        targetAnchor: anchorPosition,
        type: activeConnection.type!,
      };
      setConnections([...connections, newConnection]);
      setActiveConnection(null);
    }
  };

  const getAnchorPosition = (eventId: string, anchorPosition: string): { x: number; y: number } => {
    const element = document.getElementById(`event-${eventId}`);
    if (!element) return { x: 0, y: 0 };

    const rect = element.getBoundingClientRect();
    const containerRect = element.parentElement?.getBoundingClientRect();
    if (!containerRect) return { x: 0, y: 0 };

    switch (anchorPosition) {
      case 'top':
        return { x: rect.left + rect.width / 2 - containerRect.left, y: rect.top - containerRect.top };
      case 'right':
        return { x: rect.right - containerRect.left, y: rect.top + rect.height / 2 - containerRect.top };
      case 'bottom':
        return { x: rect.left + rect.width / 2 - containerRect.left, y: rect.bottom - containerRect.top };
      case 'left':
        return { x: rect.left - containerRect.left, y: rect.top + rect.height / 2 - containerRect.top };
      default:
        return { x: 0, y: 0 };
    }
  };

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
      
      {/* SVG container for connections */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {connections.map((connection) => {
          const source = getAnchorPosition(connection.sourceId, connection.sourceAnchor);
          const target = getAnchorPosition(connection.targetId, connection.targetAnchor);
          
          return (
            <g key={connection.id}>
              {connection.type === 'dotted' ? (
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              ) : connection.type === 'arrow-up' || connection.type === 'arrow-down' ? (
                <marker
                  id={`arrowhead-${connection.id}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                </marker>
              ) : (
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd={connection.type.includes('arrow') ? `url(#arrowhead-${connection.id})` : undefined}
                />
              )}
            </g>
          );
        })}
      </svg>
      
      <div className="pt-16 mt-16 px-4 flex gap-4">
        {events.map((event) => (
          <Draggable
            key={event.id}
            bounds="parent"
            defaultPosition={{x: 0, y: -32}}
            grid={[20, 20]}
            axis="x"
          >
            <div id={`event-${event.id}`}>
              <TimelineEvent
                id={event.id}
                title={event.title}
                time={event.time}
                description={event.description}
                type={event.type}
                onUpdate={(data) => onUpdateEvent(event.id, data)}
                onConnectionStart={(anchorPosition, connectionType) => 
                  handleConnectionStart(event.id, anchorPosition, connectionType)
                }
                onConnectionEnd={(anchorPosition) => 
                  handleConnectionEnd(event.id, anchorPosition)
                }
                isConnecting={!!activeConnection && activeConnection.sourceId !== event.id}
              />
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};