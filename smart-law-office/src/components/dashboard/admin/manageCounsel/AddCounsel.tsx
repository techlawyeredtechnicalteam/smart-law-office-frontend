"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useCounselStore } from "@/store/manageCounsel";
import React from "react";
// import { UploadFile } from "./UploadFile";
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

const AddCounselModal = () => {
  const {
    isAddModalOpen,
    closeAddModal,
    addCounsel,
    isSubmitting,
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
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FullName</FormLabel>
                    <FormControl>
                      <Input
                        type="fullName"
                        autoComplete="fullName"
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="scn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SCN</FormLabel>
                    <FormControl>
                      <Input
                        // type=""
                        placeholder="E.g. 123456"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        // autoComplete="email"
                        placeholder="christineadewale@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Counsel"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCounselModal;
