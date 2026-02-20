"use client";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { usePaystackPayment } from "react-paystack";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import FileUpload from "../../../shared/FileUpload";
import { CustomFormField } from "@/components/shared/CustomFormField";

// State & Types
import { useCounselStore } from "@/store/manageCounsel";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useAuthStore } from "@/store/authStore";
import { AddCounselFormType, AddCounselSchema } from "@/types/counselSchema";
import { uploadBarCertificate } from "@/app/api/manageCounse.api";

const AddCounselModal = () => {
  const { user } = useAuthStore();
  const {
    isAddModalOpen,
    closeAddModal,
    openAddModal,
    setFile,
    callToBarFile: uiFileName,
    addCounsel
  } = useCounselStore();
  const {
    selectedPlan,
    setPaymentReference,
    resetPayment,
    isLoading,
    setIsLoading
  } = useSubscriptionStore();

  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<AddCounselFormType>({
    resolver: zodResolver(AddCounselSchema),
    defaultValues: {
      fullName: "",
      scn: "",
      email: "",
      callToBarFile: ""
    }
  });

  const handleFileChange = async (
    base64: string | null,
    fileName: string | null
  ) => {
    if (!base64) {
      setFile(null);
      form.setValue("callToBarFile", "");
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadBarCertificate(base64, fileName!);

      // 1. Set global store (for UI/filename)
      setFile(fileName);

      // 2. Set form state (the URL for the final payload)
      form.setValue("callToBarFile", uploadedUrl);

      toast.success("Certificate uploaded and verified.");
    } catch (error: any) {
      // Axios error handling
      const errorMsg = error.response?.data?.message || "Upload failed";
      toast.error(`Error: ${errorMsg}`);
      console.error("Upload process failed:", error);

      setFile(null);
      form.setValue("callToBarFile", "");
    } finally {
      setIsUploading(false);
    }
  };

  // Paystack Config
  const config = useMemo(
    () => ({
      reference: new Date().getTime().toString(),
      email: user?.email || "",
      amount: (selectedPlan?.monthlyPrice || 0) * 100,
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ""
    }),
    [selectedPlan, user]
  );

  const initializePayment = usePaystackPayment(config);

  const handleSubmit = async (data: AddCounselFormType) => {
    if (!user?.id || !selectedPlan?.name) {
      toast.error("Session expired. Please refresh.");
      return;
    }

    const [firstName, ...rest] = data.fullName.trim().split(" ");
    const lastName = rest.join(" ") || "";

    const userPayload = {
      email: data.email,
      firstName,
      lastName,
      address: "N/A",
      consent: true,
      role: "STAFF",
      scn: data.scn,
      barCertificate: data.callToBarFile
    };

    closeAddModal();
    setIsLoading(true);

    const onSuccess = async (reference: any) => {
      setPaymentReference(reference.reference);
      toast.success("Payment successful!");

      await addCounsel(userPayload);      

      form.reset();
      setFile(null);
      resetPayment();
      setIsLoading(false);
      // closeAddModal();
    };

    const onClose = () => {
      setIsLoading(false);
      resetPayment();
      toast.info("Payment cancelled.");
    };

    initializePayment({
      onSuccess,
      onClose,
      config: {
        ...config,
        metadata: {
          userId: user.id,
          planName: selectedPlan.name,
          action: "user_create",
          userPayload: userPayload
        } as any
      }
    });
  };

  return (
    <Dialog
      open={isAddModalOpen}
      onOpenChange={(open) => !open && closeAddModal()}
    >
      <DialogContent
        className="max-w-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add New Counsel
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <CustomFormField
              control={form.control}
              name="fullName"
              label="Full Name"
              placeholder="John Doe"
            />
            <CustomFormField
              control={form.control}
              name="scn"
              label="SCN"
              placeholder="123456"
            />
            <CustomFormField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="counsel@firm.com"
            />

            <FormField
              control={form.control}
              name="callToBarFile"
              render={() => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      id="call-to-bar-upload"
                      label="Call to Bar Certificate"
                      fileData={form.watch("callToBarFile")}
                      fileName={uiFileName}
                      onFileChange={handleFileChange}
                      accept="application/pdf"
                      maxSize={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isUploading}
            >
              {isUploading
                ? "Uploading Certificate..."
                : isLoading
                  ? "Processing..."
                  : "Make Payment"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCounselModal;
