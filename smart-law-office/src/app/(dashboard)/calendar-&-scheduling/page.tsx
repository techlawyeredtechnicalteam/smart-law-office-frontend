// /app/(dashboard)/calendar/page.tsx
"use client";
import React from "react";
import { useCalendarStore } from "@/store/calendarStore";
import CalendarView from "@/components/dashboard/admin/calendar & scheduling/CalendarView";
import ScheduleConsultationModal from "@/components/dashboard/admin/calendar & scheduling/SchedueConsultationModal";
import ConsultationDetailView from "@/components/dashboard/admin/calendar & scheduling/ConsultationDetailView";

const CalendarPage = () => {
  const selectedEventId = useCalendarStore((state) => state.selectedEventId);

  return (
    <div className="">
      {selectedEventId ? <ConsultationDetailView /> : <CalendarView />}
      <ScheduleConsultationModal />
    </div>
  );
};

export default CalendarPage;
