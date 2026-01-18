"use client";
import { Button } from "@/components/ui/button";
import { useBillingStore } from "@/store/setRateBill";
import { useForm } from "react-hook-form";
import {
  setRateBillFormData,
  setRateBillSchema
} from "@/types/SetRateBill.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/shared/CustomFormField";
import { CustomSelectField } from "@/components/shared/CustomSelectField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const SetRateCase = () => {
  const {
    // getAdminCaseType,
    saveRate,
    feeSchedules,
    isSetRateCaseModalOpen,
    closeSetRateCaseModal,
    openSetRateCaseModal,
    openSetRateModal
  } = useBillingStore();

  const form = useForm<setRateBillFormData>({
    resolver: zodResolver(setRateBillSchema),
    defaultValues: {
      invoiceId: `INV-${Date.now().toString().slice(-6)}`,
      serviceType: "Case",
      caseTypeId: "",
      subServiceId: "",
      caseRate: 0,
      duration: "",
      consultationRate: 0
    }
  });

  // Watch the field so the UI re-renders when it changes
  const watchedServiceType = form.watch("serviceType");
  const watchedSubServiceId = form.watch("subServiceId");

  // Find the selected schedule object based on the ID in the dropdown
  const selectedSchedule = feeSchedules.find(
    (f) => String(f.feeScheduleId || f.id) === String(watchedSubServiceId)
  );

  const handleServiceTypeChange = (value: string) => {
    if (value === "Consultation") {
      closeSetRateCaseModal();
      openSetRateCaseModal();
    }
  };

  // const handleSubmit = (data: setRateBillFormData) => {
  //   if (selectedSchedule) {
  //     addCaseRate({
  //       serviceType: "Case",
  //       subServiceType: selectedSchedule.name,
  //       caseRate: Number(data.caseRate)
  //     });
  //     form.reset();
  //     closeSetRateCaseModal();
  //   }
  // };
  // const handleSubmit = async (data: setRateBillFormData) => {
  //   if (!selectedSchedule) {
  //     toast.error("Please select a sub-service first");
  //     return;
  //   }

  //   // Ensure caseRate is a number
  //   const payload = {
  //     serviceType: "Case",
  //     subServiceType: selectedSchedule.name,
  //     caseRate: Number(data.caseRate),
  //     feeScheduleId: selectedSchedule.feeScheduleId
  //   };

  //   const success = await saveRate(payload);
  //   if (success) {
  //     toast.success("Case rate saved successfully!");
  //     form.reset();
  //     closeSetRateCaseModal();
  //   }
  // };

  const handleSubmit = async (data: setRateBillFormData) => {
    if (!selectedSchedule) {
      toast.error("Please select a sub-service first");
      return;
    }

    const payload = {
      serviceType: "Case",
      feeScheduleId: selectedSchedule.feeScheduleId || selectedSchedule.id,
      subServiceType: selectedSchedule.name || selectedSchedule.feeScheduleName,
      caseRate: data.caseRate
    };

    const success = await saveRate(payload);
    if (success) {
      form.reset();
      closeSetRateCaseModal();
    }
  };

  return (
    <Dialog open={isSetRateCaseModalOpen} onOpenChange={closeSetRateCaseModal}>
      <DialogContent className="sm:max-w-[480px] ">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Set Case Rate</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {/* Invoice ID */}
            <CustomFormField
              control={form.control}
              name="invoiceId"
              label="Invoice ID"
              placeholder=""
              readOnly
            />

            <CustomSelectField
              control={form.control}
              name="serviceType"
              label="Service Type"
              placeholder="Select service type"
              options={[
                { label: "Case", value: "Case" },
                { label: "Consultation", value: "Consultation" }
              ]}
              className="w-full"
              onChange={(val) => {
                if (val === "Consultation") {
                  closeSetRateCaseModal();
                  openSetRateModal(); // Switch to the other modal
                }
              }}
            />

            {watchedServiceType === "Case" && (
              <>
                <CustomSelectField
                  control={form.control}
                  name="subServiceId"
                  label="Sub-service"
                  placeholder={
                    feeSchedules.length === 0
                      ? "No case types available"
                      : "Select a sub-service"
                  }
                  options={feeSchedules.map((f) => ({
                    label: f.name || f.feeScheduleName,
                    value: String(f.feeScheduleId || f.id)
                  }))}
                  onChange={(val) =>
                    form.setValue("caseTypeId", val, { shouldValidate: true })
                  }
                  className="w-full"
                />

                {selectedSchedule && (
                  <div className="p-3 bg-violet-50 border border-violet-100 rounded-lg">
                    <p className="text-xs text-violet-600 font-medium">
                      LPRO Rate Range
                    </p>
                    <p className="text-sm font-bold text-violet-900">
                      ₦{selectedSchedule.rateMin?.toLocaleString()} - ₦
                      {selectedSchedule.rateMax?.toLocaleString()}
                    </p>
                  </div>
                )}

                <CustomFormField
                  control={form.control}
                  name="caseRate"
                  label="Case Rate"
                  type="number"
                  placeholder="E.g 200000"
                />
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeSetRateCaseModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-violet-600"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SetRateCase;
