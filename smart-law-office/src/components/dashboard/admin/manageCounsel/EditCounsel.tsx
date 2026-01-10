"use client";

import { useCounselStore, Counsel } from "@/store/manageCounsel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import FileUpload from "../../../shared/FileUpload";
// import { UploadFile } from "./UploadFile";

const EditCounselModal = () => {
  const {
    isEditModalOpen,
    closeEditModal,
    selectedCounsel,
    updateCounsel,
    isSubmitting,
    callToBarFile
  } = useCounselStore();

  const [form, setForm] = useState<Partial<Counsel>>({});

  useEffect(() => {
    if (selectedCounsel) {
      setForm({
        fullName: selectedCounsel.fullName,
        scn: selectedCounsel.scn,
        email: selectedCounsel.email,
        callToBarFile: selectedCounsel.callToBarFile
      });
    }
  }, [selectedCounsel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (fileName: string | null) => {
    setForm({ ...form, callToBarFile: fileName });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCounsel) {
      console.error("No selected counsel for editing");
      return;
    }

    try {
      // transform form data
      const nameParts = (form.fullName || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const payload = {
        ...(form.email && { email: form.email }),
        ...(form.fullName && { firstName, lastName }),
        ...(form.scn && { scn: form.scn }),
        ...(form.callToBarFile && { barCertificate: form.callToBarFile })
      };

      console.log("Edit payload:", payload);
      await updateCounsel(selectedCounsel.id, payload);
      closeEditModal(); // Close modal after successful update
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  if (!selectedCounsel) return null;

  return (
    <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Counsel</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="editFullName">Full name</Label>
            <div className="relative">
              <Input
                id="editFullName"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName || ""}
                onChange={handleChange}
              />
              {/* Checkmark for visual confirmation (replicated from mockup) */}
              <Check className="w-4 h-4 text-green-600 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* SCN Number */}
          <div className="space-y-2">
            <Label htmlFor="editScn">SCN Number</Label>
            <Input
              id="editScn"
              name="scn"
              placeholder="SCN Number"
              value={form.scn || ""}
              onChange={handleChange}
            />
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="editEmail">Email Address</Label>
            <Input
              id="editEmail"
              name="email"
              placeholder="Email Address"
              type="email"
              value={form.email || ""}
              onChange={handleChange}
            />
          </div>

          {/* Call to Bar Certificate */}
          <FileUpload
            id="call-to-bar-upload"
            label="Call to Bar Certificate"
            fileData={callToBarFile}
            onFileChange={handleFileChange}
            accept="application/pdf"
            maxSize={5}
            fileTypeInfo="PDF only. Max 5MB"
          />

          <div className="flex justify-end pt-4 space-x-2">
            <Button type="button" variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCounselModal;
