// /components/dashboard/calendar/ScheduleConsultationModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCalendarStore } from "@/store/calendarStore";
import { Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

// --- Step 1: Schedule Form ---
const ScheduleForm = () => {
  const { draftConsultation, saveDraft, setModalStep, scheduleConsultation } =
    useCalendarStore();

  const [form, setForm] = useState(
    draftConsultation || {
      title: "",
      clientName: "",
      clientEmail: "",
      duration: "",
      date: "",
      time: "",
      notes: ""
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    saveDraft({ [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(form).some((val) => !val)) {
      toast.error("Please fill all required fields.");
      return;
    }
    // Final save and transition to sharing step
    scheduleConsultation();
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Input
        id="title"
        label="Title"
        placeholder="Litigation"
        value={form.title}
        onChange={handleChange}
        required
      />
      <Input
        id="clientName"
        label="Client Name"
        placeholder="Jane Francis"
        value={form.clientName}
        onChange={handleChange}
        required
      />
      <Input
        id="clientEmail"
        label="Client Email"
        placeholder="E.g. christineadeola@gmail.com"
        value={form.clientEmail}
        onChange={handleChange}
        required
      />
      <Input
        id="duration"
        label="Duration"
        placeholder="E.g. 1 hour"
        value={form.duration}
        onChange={handleChange}
        required
      />

      <div className="flex space-x-4">
        <div className="w-1/2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="text"
            placeholder="dd/mm/yy"
            value={form.date}
            onChange={handleChange}
            icon={Calendar}
            required
          />
        </div>
        <div className="w-1/2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="text"
            placeholder="--:--"
            value={form.time}
            onChange={handleChange}
            icon={Clock}
            required
          />
        </div>
      </div>

      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        placeholder="E.g. contract review inquiry, initial case discussion..."
        value={form.notes}
        onChange={handleChange}
      />

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={useCalendarStore.getState().closeScheduleModal}
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
          Schedule Consultation
        </Button>
      </div>
    </form>
  );
};

// --- Step 2: Share Confirmation ---
const ShareConfirmation = () => {
  const { draftConsultation, closeScheduleModal } = useCalendarStore();

  // We reuse draftConsultation which was populated by the newly scheduled event in scheduleConsultation()
  const { clientName, date, time, duration } = draftConsultation as any;

  const handleCopy = () => {
    const textToCopy = `${clientName} Scheduled a consultation with you. ${date}, ${time}. The meeting is scheduled to last ${duration}.`;
    navigator.clipboard.writeText(textToCopy);
    toast.success("Consultation information copied to clipboard!");
  };

  // Note: The original mockup shows 'Jane Francis Scheduled a consultation with you' which implies the client is Jane Francis.
  // The share text uses this structure.

  return (
    <div className="text-center space-y-6">
      <h2 className="text-xl font-bold">Consultation scheduled</h2>
      <p className="text-gray-600">
        Share consultation information with individuals involved
      </p>

      <div className="bg-violet-50 p-6 rounded-xl border border-violet-200 text-left space-y-2">
        <h3 className="font-semibold text-lg text-violet-800">
          {clientName} Scheduled a consultation with you
        </h3>
        <p className="text-gray-700">
          <span className="font-medium">
            {date}, {time}
          </span>
        </p>
        <p className="text-gray-500 text-sm">
          The meeting is scheduled to last {duration}.
        </p>
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={closeScheduleModal}>
          Close
        </Button>
        <Button
          onClick={handleCopy}
          className="bg-violet-600 hover:bg-violet-700"
        >
          Copy
        </Button>
      </div>
    </div>
  );
};

const ScheduleConsultationModal = () => {
  const { isModalOpen, closeScheduleModal, modalStep } = useCalendarStore();

  const getModalContent = () => {
    switch (modalStep) {
      case 1:
        return <ScheduleForm />;
      case 2:
        return <ShareConfirmation />;
      // case 3: return <SuccessConfirmation />; // Not explicitly shown, but could be added
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    if (modalStep === 1) return "Schedule Consultation";
    if (modalStep === 2) return "Share Consultation";
    return "Consultation Scheduled";
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeScheduleModal}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>
        {getModalContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleConsultationModal;
