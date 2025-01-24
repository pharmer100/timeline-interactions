import React, { useState, useRef, useEffect } from 'react';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeConnection && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    if (activeConnection) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeConnection]);

  const handleConnectionStart = (eventId: string, anchorPosition: string, connectionType: string) => {
    const sourceElement = document.getElementById(`event-${eventId}`);
    if (!sourceElement || !containerRef.current) return;

    const sourceRect = sourceElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    let startX = sourceRect.left - containerRect.left;
    let startY = sourceRect.top - containerRect.top;

    // Adjust position based on anchor point
    switch (anchorPosition) {
      case 'top':
        startX += sourceRect.width / 2;
        break;
      case 'right':
        startX += sourceRect.width;
        startY += sourceRect.height / 2;
        break;
      case 'bottom':
        startX += sourceRect.width / 2;
        startY += sourceRect.height;
        break;
      case 'left':
        startY += sourceRect.height / 2;
        break;
    }

    setActiveConnection({
      sourceId: eventId,
      sourceAnchor: anchorPosition,
      type: connectionType,
      startX,
      startY,
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
    }
    setActiveConnection(null);
  };

  const getAnchorPosition = (eventId: string, anchorPosition: string): { x: number; y: number } => {
    const element = document.getElementById(`event-${eventId}`);
    if (!element || !containerRef.current) return { x: 0, y: 0 };

    const rect = element.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

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
    <div className="min-h-[200px] relative" ref={containerRef}>
      <div className="absolute left-4 top-4 flex items-center gap-4">
        <h3 className="font-semibold">{name}</h3>
        <Button variant="outline" size="sm" onClick={onAddEvent}>
          <Plus className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </div>
      
      <div className="absolute left-0 right-0 top-[4.5rem] h-[2px] bg-timeline-ruler"></div>
      
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
                  stroke="currentColor"
                  className="text-timeline-connection"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              ) : (
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="currentColor"
                  className="text-timeline-connection"
                  strokeWidth="2"
                  markerEnd={connection.type.includes('arrow') ? `url(#arrowhead-${connection.id})` : undefined}
                />
              )}
              {connection.type.includes('arrow') && (
                <defs>
                  <marker
                    id={`arrowhead-${connection.id}`}
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" className="fill-timeline-connection" />
                  </marker>
                </defs>
              )}
            </g>
          );
        })}
        
        {activeConnection && (
          <line
            x1={activeConnection.startX}
            y1={activeConnection.startY}
            x2={mousePosition.x}
            y2={mousePosition.y}
            stroke="currentColor"
            className="text-timeline-connection"
            strokeWidth="2"
            strokeDasharray={activeConnection.type === 'dotted' ? '4' : undefined}
            markerEnd={activeConnection.type.includes('arrow') ? 'url(#active-arrowhead)' : undefined}
          />
        )}
        {activeConnection?.type.includes('arrow') && (
          <defs>
            <marker
              id="active-arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" className="fill-timeline-connection" />
            </marker>
          </defs>
        )}
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