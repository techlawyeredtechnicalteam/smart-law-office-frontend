// /components/dashboard/calendar/ConsultationDetailView.tsx
import React from "react";
import { useCalendarStore } from "@/store/calendarStore";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const DetailRow = ({
  label,
  value,
  status
}: {
  label: string;
  value: string;
  status?: string;
}) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100">
    <span className="text-gray-500 font-medium">{label}</span>
    {status ? (
      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-700">
        {value}
      </span>
    ) : (
      <span className="font-semibold text-gray-900">{value}</span>
    )}
  </div>
);

const ConsultationDetailView = () => {
  const { events, selectedEventId, viewConsultationDetail } =
    useCalendarStore();

  const event = events.find((e) => e.id === selectedEventId);

  if (!event || event.type !== "Consultation") {
    return <div className="p-6">Consultation details not found.</div>;
  }

  const handleBack = () => viewConsultationDetail(null);

  return (
    <div className="space-y-6">
      <header className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-gray-600"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">
          Consultation with {event.clientName}
        </h1>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-6">
        <h2 className="text-xl font-semibold border-b pb-3">Details</h2>

        <DetailRow label="Consultation ID" value="2025-0012" />
        <DetailRow label="Title" value={event.title} />
        <DetailRow label="Client name" value={event.clientName} />
        <DetailRow label="Status" value={event.status} status="Scheduled" />
        <DetailRow label="Date" value={event.date} />
        <DetailRow label="Time" value={event.time} />

        <div className="pt-4">
          <h3 className="text-gray-500 font-medium mb-2">Notes</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800">
              {event.notes || "No notes provided."}
            </p>
            <div className="flex items-center text-xs text-gray-400 mt-2">
              <Clock className="h-3 w-3 mr-1" />
              {/* Mocking the note timestamp from the mockup */}
              Monday, March 02, 2025 | 10:00 AM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailView;
