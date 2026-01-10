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

const SetRateCaseModal = () => {
  const { feeSchedules, addCaseRate, closeSetRateCaseModal } =
    useBillingStore();

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

  // watch the selected sub-service to display LPRO rate range automatically
  const watchedSubServiceId = form.watch("subServiceId");
  const selectedSchedule = feeSchedules.find(
    (f) => f.id === watchedSubServiceId
  );

  const onSubmit = (data: setRateBillFormData) => {
    // ensure we have a selected schedule before submitting
    if (!selectedSchedule) return;

    // login for when user clicks save
    addCaseRate({
      serviceType: "Case",
      subServiceType: selectedSchedule.name,
      caseRate: data.caseRate
    });

    form.reset();
    closeSetRateCaseModal();
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Invoice ID */}
        <CustomFormField
          control={form.control}
          name="invoiceId"
          label="Invoice ID"
          placeholder=""
          readOnly
        />

        {/* Using your new CustomSelectField */}
        <CustomSelectField
          control={form.control}
          name="subServiceId"
          label="Sub-service"
          placeholder="Select a sub-service"
          options={feeSchedules.map((f) => ({ label: f.name, value: f.id }))}
        />

        {/* Logical Display: Show LPRO Range if a sub-service is picked */}
        {selectedSchedule && (
          <div className="p-3 bg-violet-50 border border-violet-100 rounded-lg">
            <p className="text-xs text-violet-600 font-medium">
              LPRO Rate Range
            </p>
            <p className="text-sm font-bold text-violet-900">
              ₦{selectedSchedule.lproRateRange}
            </p>
          </div>
        )}

        <CustomFormField
          control={form.control}
          name="caseRate"
          label="Service Charge"
          type="number"
          placeholder="0.00"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={closeSetRateCaseModal}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-violet-600">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SetRateCaseModal;
