"use client";
import { CustomFormField } from "@/components/shared/CustomFormField";
import { CustomSelectField } from "@/components/shared/CustomSelectField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useBillingStore } from "@/store/setRateBill";
import {
  setRateBillFormData,
  setRateBillSchema
} from "@/types/SetRateBill.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { toast } from "sonner";

const SetRateConsultation = () => {
  const {
    saveRate,
    openSetRateCaseModal,
    isSetRateModalOpen,
    closeSetRateModal,
    isLoading
  } = useBillingStore();

  const form = useForm<setRateBillFormData>({
    resolver: zodResolver(setRateBillSchema),
    defaultValues: {
      invoiceId: `INV-${Date.now().toString().slice(-6)}`,
      serviceType: "Consultation",
      caseTypeId: "",
      subServiceId: "",
      caseRate: 0,
      duration: "",
      consultationRate: undefined
    }
  });

  // Watch service type to handle switching to Case
  const watchedServiceType = form.watch("serviceType");

  const handleSubmit = async (data: setRateBillFormData) => {
    // Basic validation check
    if (!data.duration || !data.consultationRate) {
      toast.error("Please fill in all fields");
      return;
    }

    const success = await saveRate({
      serviceType: "Consultation",
      duration: data.duration,
      rate: data.consultationRate
    });

    if (success) {
      // Success toast is already handled inside the store's saveRate
      form.reset();
      closeSetRateModal();
    }
  };

  return (
    <Dialog open={isSetRateModalOpen} onOpenChange={closeSetRateModal}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Set Consultation Rate
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-6 p-1"
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

            {/* Service Type */}
            <CustomSelectField
              control={form.control}
              name="serviceType"
              label="Service Type"
              placeholder="Service Type"
              options={[
                { label: "Consultation", value: "Consultation" },
                { label: "Case", value: "Case" }
              ]}
              onChange={(value) => {
                if (value === "Case") {
                  closeSetRateModal();
                  openSetRateCaseModal();
                }
              }}
              className="w-full"
            />
            {/* Duration - Only show for Consultation */}
            {watchedServiceType === "Consultation" && (
              <>
                <CustomFormField
                  control={form.control}
                  name="duration"
                  label="Duration (Minutes)"
                  placeholder="e.g. 30"
                  type="text"
                  inputMode="numeric"
                />

                {/* <CustomFormField
                  control={form.control}
                  name="consultationRate"
                  label="Consultation Rate"
                  type="number"
                  placeholder="E.g. 150000"
                /> */}
                <CustomFormField
                  control={form.control}
                  name="consultationRate"
                  label="Consultation Rate"
                  type="number" // Rate is a number in your schema, so this is fine
                  placeholder="E.g. 150000"
                />
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeSetRateModal}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SetRateConsultation;
