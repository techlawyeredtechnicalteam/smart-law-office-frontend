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
    addCaseRate,
    isSetRateCaseModalOpen,
    closeSetRateCaseModal,
    openSetRateCaseModal,
    openSetRateModal
  } = useBillingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug: Log feeSchedules to see what data we have
  console.log("SetRateCase - feeSchedules:", feeSchedules);

  const form = useForm<setRateBillFormData>({
    resolver: zodResolver(setRateBillSchema),
    defaultValues: {
      invoiceId: `INV-${Date.now().toString().slice(-6)}`,
      serviceType: "Case",
      caseTypeId: "",
      subServiceId: "",
      caseRate: undefined,
      duration: "",
      consultationRate: undefined
    }
  });

  // Watch the field so the UI re-renders when it changes
  const watchedServiceType = form.watch("serviceType");
  const watchedSubServiceId = form.watch("subServiceId");

  // logic to find the sub-service from your flat array
  const selectedSchedule = feeSchedules.find(
    (f) => String(f.feeScheduleId) === String(watchedSubServiceId)
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

    // Ensure we are passing the ID that exists on the object
    const idToSend = selectedSchedule.feeScheduleId || selectedSchedule.id;

    if (!idToSend || idToSend.startsWith("mock-")) {
      toast.error(
        "Cannot save mock data to server. Please select a real case type."
      );
      return;
    }

    const payload = {
      serviceType: "Case",
      feeScheduleId: selectedSchedule.feeScheduleId,
      subServiceType: selectedSchedule.name, // THIS IS WHAT THE TABLE NEEDS
      caseRate: data.caseRate
    };
    await saveRate(payload);
    if (payload) {
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
              onChange={handleServiceTypeChange}
              className="w-full"
            />

            {watchedServiceType === "Case" && (
              <>
                {feeSchedules.length === 0 ? (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      No case types available. Please ensure case types are
                      configured.
                    </p>
                  </div>
                ) : (
                  <CustomSelectField
                    control={form.control}
                    name="subServiceId"
                    label="Sub-service"
                    placeholder="Select a sub-service"
                    className="w-full"
                    options={feeSchedules.map((f, index) => {
                      return {
                        label:
                          f.name || f.feeScheduleName || `Service ${index + 1}`,
                        value:
                          f.feeScheduleId ||
                          f.id ||
                          f.caseTypeId ||
                          String(index)
                      };
                    })}
                    onChange={(val) => {
                      // Manually update caseTypeId to satisfy your Zod schema
                      form.setValue("caseTypeId", val, {
                        shouldValidate: true
                      });
                    }}
                  />
                )}

                {/* Logical Display: Show LPRO Range if a sub-service is picked */}
                {/* {selectedSchedule && (
                  <div className="p-3 bg-violet-50 border border-violet-100 rounded-lg">
                    <p className="text-xs text-violet-600 font-medium">
                      LPRO Rate Range
                    </p>
                    <p className="text-sm font-bold text-violet-900">
                      ₦{selectedSchedule.lproRateRange}
                    </p>
                  </div>
                )} */}
                {selectedSchedule && (
                  <div className="p-3 bg-violet-50 border border-violet-100 rounded-lg">
                    <p className="text-xs text-violet-600 font-medium">
                      LPRO Rate Range
                    </p>
                    <p className="text-sm font-bold text-violet-900">
                      ₦{selectedSchedule.rateMin.toLocaleString()} - ₦
                      {selectedSchedule.rateMax.toLocaleString()}
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
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-violet-600"
                disabled={form.formState.isSubmitting}
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SetRateCase;
