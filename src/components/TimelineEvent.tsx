import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Camera, Video, Calendar, Bell, AlertTriangle, Flag, PenSquare, ArrowLeftRight, ArrowUp, ArrowDown, Minus, Circle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimelineEventProps {
  title: string;
  time: string;
  description: string;
  type: string;
  onUpdate: (data: { title: string; time: string; description: string; type: string }) => void;
}

const eventIcons: Record<string, React.ReactNode> = {
  camera: <Camera className="h-6 w-6" />,
  video: <Video className="h-6 w-6" />,
  calendar: <Calendar className="h-6 w-6" />,
  alert: <AlertTriangle className="h-6 w-6" />,
  notification: <Bell className="h-6 w-6" />,
  flag: <Flag className="h-6 w-6" />,
};

const connectionTypes = [
  { id: 'line', icon: <Minus className="h-4 w-4" />, label: 'Solid Line' },
  { id: 'dotted', icon: <Circle className="h-4 w-4" />, label: 'Dotted Line' },
  { id: 'arrow-up', icon: <ArrowUp className="h-4 w-4" />, label: 'Arrow Up' },
  { id: 'arrow-down', icon: <ArrowDown className="h-4 w-4" />, label: 'Arrow Down' },
  { id: 'two-way', icon: <ArrowLeftRight className="h-4 w-4" />, label: 'Two Way Arrow' },
];

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  title,
  time,
  description,
  type,
  onUpdate,
}) => {
  const [editTitle, setEditTitle] = React.useState(title);
  const [editTime, setEditTime] = React.useState(time);
  const [editDescription, setEditDescription] = React.useState(description);
  const [editType, setEditType] = React.useState(type);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedConnectionType, setSelectedConnectionType] = useState<string | null>(null);

  const handleSave = () => {
    onUpdate({
      title: editTitle,
      time: editTime,
      description: editDescription,
      type: editType,
    });
  };

  const handleConnectionStart = (connectionType: string) => {
    setSelectedConnectionType(connectionType);
    setIsConnecting(true);
    // Here you would implement the actual connection logic
    // This could involve drawing SVG lines or using a library like jsPlumb
    console.log('Starting connection with type:', connectionType);
  };

  return (
    <Card className="w-64 p-4 shadow-md bg-timeline-event animate-fade-in relative">
      <div className="flex justify-between items-start mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6 absolute left-2 top-2"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {connectionTypes.map((connType) => (
              <DropdownMenuItem 
                key={connType.id}
                onClick={() => handleConnectionStart(connType.id)}
                className="flex items-center gap-2"
              >
                {connType.icon}
                <span>{connType.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex flex-col items-center mx-auto">
          {eventIcons[type.toLowerCase()]}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6 absolute right-2 top-2"
            >
              <PenSquare className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Type</label>
                <Select value={editType} onValueChange={setEditType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="camera">Camera</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="calendar">Calendar</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="flag">Flag</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Event title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="datetime-local"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Event description"
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="text-sm text-gray-500 mt-4">{time}</div>
      <h3 className="font-semibold mt-1">{title}</h3>
      <div className="text-sm mt-2">{description}</div>
    </Card>
  );
};