import React from 'react';
import { Card } from '@/components/ui/card';
import { Camera, Video, Calendar, Bell, AlertTriangle, Flag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

  const handleSave = () => {
    onUpdate({
      title: editTitle,
      time: editTime,
      description: editDescription,
      type: editType,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="w-64 p-4 shadow-md bg-timeline-event animate-fade-in cursor-pointer hover:shadow-lg">
          <div className="flex flex-col items-center mb-2">
            {eventIcons[type.toLowerCase()]}
          </div>
          <div className="text-sm text-gray-500">{time}</div>
          <h3 className="font-semibold mt-1">{title}</h3>
          <div className="text-sm mt-2">{description}</div>
        </Card>
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
  );
};