"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCounselStore } from "@/store/manageCounsel";
import { useForm } from "react-hook-form";
import { AddCounselFormType, AddCounselSchema } from "@/types/counselSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import FileUpload from "../../../shared/FileUpload";
import { CustomFormField } from "@/components/shared/CustomFormField";

const AddCounselModal = () => {
  const {
    isAddModalOpen,
    closeAddModal,
    addCounsel,
    isLoading,
    setFile,
    callToBarFile
  } = useCounselStore();

  const form = useForm<AddCounselFormType>({
    resolver: zodResolver(AddCounselSchema),
    defaultValues: {
      fullName: "",
      scn: "",
      email: "",
      callToBarFile: ""
    }
  });

  const handleFileChange = (
    fileName: string | null,
    fileData: string | null
  ) => {
    setFile(fileName);
    form.setValue("callToBarFile", fileName || "");
  };

  const handleSubmit = async (data: AddCounselFormType) => {
    try {
      // split fullName into firstName and lastName
      const nameParts = data.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // transform the form data to match API payload
      const payload = {
        email: data.email,
        firstName: firstName,
        lastName: lastName,
        address: "N/A",
        consent: true,
        role: "STAFF",
        scn: data.scn,
        barCertificate: data.callToBarFile
      };

      await addCounsel(payload);
      form.reset();
      setFile(null);
      closeAddModal();
    } catch (error) {
      console.error("Error Adding Counsel:", error);
    }
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={closeAddModal}>
      <DialogContent className="max-w-7xl">
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
              label="FullName"
              type="text"
              autoComplete="fullName"
              placeholder="Enter your name"
            />

            <CustomFormField
              control={form.control}
              name="scn"
              label="SCN"
              placeholder="E.g. 123456"
            />

            <CustomFormField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="christineadewale@gmail.com"
            />

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="callToBarFile"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel></FormLabel> */}
                    <FormControl>
                      <FileUpload
                        id="call-to-bar-upload"
                        label="Call to Bar Certificate"
                        fileData={callToBarFile}
                        onFileChange={handleFileChange}
                        accept="application/pdf"
                        maxSize={5}
                        fileTypeInfo="PDF only. Max 5MB"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              AddCounsel
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCounselModal;
