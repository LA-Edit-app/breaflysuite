import { useState } from "react";
import { Plus, Calendar, Clock, Type, Palette, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateCustomEvent, type CustomEventInsert } from "@/hooks/useCustomEvents";
import { format } from "date-fns";

// Predefined color options for events
const EVENT_COLORS = [
  { name: "Blue", value: "#3b82f6", bg: "bg-blue-500" },
  { name: "Green", value: "#10b981", bg: "bg-emerald-500" },
  { name: "Purple", value: "#8b5cf6", bg: "bg-violet-500" },
  { name: "Red", value: "#ef4444", bg: "bg-red-500" },
  { name: "Orange", value: "#f59e0b", bg: "bg-amber-500" },
  { name: "Pink", value: "#ec4899", bg: "bg-pink-500" },
  { name: "Indigo", value: "#6366f1", bg: "bg-indigo-500" },
  { name: "Gray", value: "#6b7280", bg: "bg-gray-500" },
];

interface AddCustomEventDialogProps {
  children?: React.ReactNode;
  defaultDate?: string; // YYYY-MM-DD format
}

export function AddCustomEventDialog({ 
  children, 
  defaultDate 
}: AddCustomEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(defaultDate || format(new Date(), "yyyy-MM-dd"));
  const [eventTime, setEventTime] = useState("");
  const [allDay, setAllDay] = useState(true);
  const [color, setColor] = useState(EVENT_COLORS[0].value);

  const createCustomEvent = useCreateCustomEvent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter an event title");
      return;
    }

    if (!eventDate) {
      toast.error("Please select an event date");
      return;
    }

    if (!allDay && !eventTime) {
      toast.error("Please specify a time or mark as all-day");
      return;
    }

    try {
      const eventData: CustomEventInsert = {
        title: title.trim(),
        description: description.trim() || null,
        event_date: eventDate,
        event_time: allDay ? null : eventTime,
        all_day: allDay,
        color,
      };

      await createCustomEvent.mutateAsync(eventData);
      
      toast.success("Custom event added successfully");
      
      // Reset form
      setTitle("");
      setDescription("");
      setEventDate(defaultDate || format(new Date(), "yyyy-MM-dd"));
      setEventTime("");
      setAllDay(true);
      setColor(EVENT_COLORS[0].value);
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create custom event");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Add Custom Event
            </DialogTitle>
            <DialogDescription>
              Create a custom event for your calendar that's not related to any campaign.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Event Title */}
            <div className="grid gap-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Event Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title..."
                className="col-span-3"
                required
              />
            </div>

            {/* Event Description */}
            <div className="grid gap-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add event details (optional)..."
                className="col-span-3 resize-none"
                rows={3}
              />
            </div>

            {/* Event Date */}
            <div className="grid gap-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            {/* All Day Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="all-day" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                All Day
              </Label>
              <Switch
                id="all-day"
                checked={allDay}
                onCheckedChange={setAllDay}
              />
            </div>

            {/* Event Time (if not all day) */}
            {!allDay && (
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="col-span-3"
                />
              </div>
            )}

            {/* Color Selection */}
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Color
              </Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full`}
                        style={{ backgroundColor: color }}
                      />
                      {EVENT_COLORS.find((c) => c.value === color)?.name || "Custom"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {EVENT_COLORS.map((colorOption) => (
                    <SelectItem key={colorOption.value} value={colorOption.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full ${colorOption.bg}`}
                        />
                        {colorOption.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createCustomEvent.isPending}>
              {createCustomEvent.isPending ? "Adding..." : "Add Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}