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
    addConsultationRate,
    isSetRateModalOpen,
    closeSetRateModal
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
      consultationRate: 0
    }
  });

  // Watch service type to handle switching to Case
  const watchedServiceType = form.watch("serviceType");

  // Handle service type change
  const handleServiceTypeChange = (value: string) => {
    if (value === "Case") {
      closeSetRateModal();
      openSetRateCaseModal();
    } else {
      form.setValue("serviceType", value as "Consultation" | "Case");
    }
  };

  // const handleSubmit = (data: setRateBillFormData) => {
  //   if (!data.duration || !data.consultationRate) return;

  //   addConsultationRate({
  //     serviceType: "Consultation",
  //     duration: data.duration,
  //     rate: data.consultationRate
  //   });

  //   form.reset();
  //   closeSetRateModal();
  // };

  const handleSubmit = async (data: setRateBillFormData) => {
    if (!data.duration || !data.consultationRate) {
      toast.error("Please fill in all fields");
      return;
    }

    const success = await saveRate({
      serviceType: "Consultation",
      duration: data.duration,
      rate: Number(data.consultationRate)
    });

    if (success) {
      toast.success("Consultation rate saved!");
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
              placeholder="Select service type"
              options={[
                { label: "Consultation", value: "Consultation" },
                { label: "Case", value: "Case" }
              ]}
              onChange={handleServiceTypeChange}
              className="w-full"
            />

            {/* Duration - Only show for Consultation */}
            {watchedServiceType === "Consultation" && (
              <>
                {/* <CustomFormField
                  control={form.control}
                  name="duration"
                  label="Duration"
                  placeholder="E.g. 30 minutes"
                /> */}
                <CustomFormField
                  control={form.control}
                  name="duration"
                  label="Duration (Minutes)"
                  type="number" // Force numeric input
                  placeholder="e.g. 30"
                />

                {/* Consultation Rate */}
                <CustomFormField
                  control={form.control}
                  name="consultationRate"
                  label="Consultation Rate"
                  type="number"
                  placeholder="E.g. 150000"
                />
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeSetRateModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700"
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

export default SetRateConsultation;
