"use client";
import React from "react";
import { useCalendarStore, ScheduledEvent } from "@/store/calendarStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils"; // For class merging

const DayCell = ({
  day,
  date,
  events
}: {
  day: string;
  date: number;
  events: ScheduledEvent[];
}) => {
  const viewConsultationDetail = useCalendarStore(
    (state) => state.viewConsultationDetail
  );
  const isSelectedDay = date === 11; // Hardcoding March 11th as selected for mockup match

  // Filter events for this specific day (simplified: assumes the mock date corresponds to the grid position)
  const dayEvents = events.filter((e) => e.date.includes(date.toString()));

  return (
    <div
      className={cn(
        "p-2 border border-gray-200 h-28 relative cursor-pointer",
        isSelectedDay && "bg-violet-100 border-violet-400"
      )}
    >
      <span className="text-xs absolute top-1 right-1 font-medium text-gray-500">
        {date}
      </span>
      {dayEvents.slice(0, 1).map((event) => (
        <div
          key={event.id}
          onClick={() => viewConsultationDetail(event.id)}
          className="bg-violet-200 text-violet-800 text-xs p-1 rounded mt-4 overflow-hidden truncate"
        >
          {event.title}...
          <span className="block font-semibold">{event.time}</span>
        </div>
      ))}
    </div>
  );
};

const CalendarGrid = () => {
  // Simplified fixed grid for March 2025 to match mockup
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1); // 1 to 31
  const firstDayOffset = 6; // March 1st 2025 is a Saturday, so 6 offset (Sunday=0)
  const monthDates = [
    ...Array(firstDayOffset).fill(null), // Empty cells before the 1st
    ...dates
  ];

  const events = useCalendarStore((state) => state.events);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-full overflow-x-auto">
      <div className="grid grid-cols-7 gap-px text-center text-sm font-semibold border-b pb-2">
        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {monthDates.map((date, index) => (
          <div key={index} className="min-w-0">
            <DayCell
              day={days[index % 7]}
              date={date}
              events={date ? events : []}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const EventListItem = ({ event }: { event: ScheduledEvent }) => {
  const viewConsultationDetail = useCalendarStore(
    (state) => state.viewConsultationDetail
  );

  let icon: React.ReactNode;
  let color: string;

  switch (event.type) {
    case "Consultation":
      icon = <Clock className="h-4 w-4" />;
      color = "text-violet-600";
      break;
    case "Deadline":
      icon = <Briefcase className="h-4 w-4" />;
      color = "text-red-600";
      break;
    case "Meeting":
      icon = <MapPin className="h-4 w-4" />;
      color = "text-green-600";
      break;
  }

  const handleClick = () => {
    if (event.type === "Consultation") {
      viewConsultationDetail(event.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition",
        event.type === "Consultation" && "border-l-4 border-violet-600" // Highlight consultations
      )}
    >
      <div className={cn("p-2 rounded-full", color, "bg-opacity-10")}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold">
          {event.time} - {event.title}
        </p>
        <p className="text-xs text-gray-500">
          {event.type === "Consultation"
            ? `Consultation with ${event.clientName}`
            : event.title}
        </p>
      </div>
    </div>
  );
};

const CalendarView = () => {
  const { currentMonth, events, openScheduleModal } = useCalendarStore();

  // Hardcoding selected date for event list to match mockup (March 11)
  const selectedDayEvents = events.filter((e) => e.date.includes("March 11"));

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar & Scheduling</h1>
        <Button
          onClick={openScheduleModal}
          className="bg-violet-600 hover:bg-violet-700"
        >
          Schedule Consultation
        </Button>
      </header>

      {/* Month Navigation */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{currentMonth}</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CalendarGrid />

      {/* Event List for Selected Day */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Wednesday, March 11</h3>
        <p className="text-sm text-gray-500 mb-4">
          {selectedDayEvents.length} events
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {selectedDayEvents.map((event) => (
            <EventListItem key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
