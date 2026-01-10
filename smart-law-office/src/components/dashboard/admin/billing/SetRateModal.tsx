"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useBillingStore } from "@/store/setRateBill";
import React, { useState } from "react";

const SetRateModal = () => {
  const {
    isSetRateModalOpen,
    closeSetRateModal,
    openSetRateCaseModal,
    addConsultationRate
  } = useBillingStore();
  const [serviceType, setServiceType] = useState("Consultation");
  const [duration, setDuration] = useState("");
  const [consultationRate, setConsultationRate] = useState("");

  const handleServiceChange = (value: string) => {
    if (value === "Case") {
      closeSetRateModal();
      openSetRateCaseModal();
    } else {
      setServiceType(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration || !consultationRate) return;

    addConsultationRate({
      serviceType: "Consultation",
      duration: duration,
      rate: parseFloat(consultationRate.replace(/,/g, ""))
    });

    // Reset and close
    setDuration("");
    setConsultationRate("");
    closeSetRateModal();
  };

  return (
    <Dialog open={isSetRateModalOpen} onOpenChange={closeSetRateModal}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Set Rate</DialogTitle>
        </DialogHeader>

        <form className="space-y-6 p-1" onSubmit={handleSubmit}>
          {/* Invoice ID */}
          <div className="space-y-2">
            <Label htmlFor="invoice-id">Invoice ID</Label>
            <Input id="invoice-id" value="2025-0012" disabled />
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="service-type">Service Type</Label>
            <Select value={serviceType} onValueChange={handleServiceChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consultation">Consultation</SelectItem>
                <SelectItem value="Case">Case</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {serviceType === "Consultation" && (
            <>
              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="E.g. 30 minutes"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              {/* Consultation Rate */}
              <div className="space-y-2">
                <Label htmlFor="rate">Consultation Rate</Label>
                <div className="relative">
                  <Input
                    id="rate"
                    placeholder="E.g. 150,000"
                    value={consultationRate}
                    onChange={(e) => setConsultationRate(e.target.value)}
                    className="pl-8"
                  />
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₦
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={closeSetRateModal}>
              Cancel
            </Button>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SetRateModal;
