"use client";

import { useCounselStore } from "@/store/manageCounsel";
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
import { Lawyer } from "@/types/user";

type EditForm = Pick<Lawyer, "name" | "scn" | "email" | "callToBarFile">;

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(" ");
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || ""
  };
};

const EditCounselModal = () => {
  const {
    isEditModalOpen,
    closeEditModal,
    selectedCounsel,
    updateCounsel,
    isLoading,
    callToBarFile,
    setFile
  } = useCounselStore();

  const [form, setForm] = useState<EditForm>({
    name: "",
    scn: "",
    email: "",
    callToBarFile: null
  });

  useEffect(() => {
    if (!selectedCounsel) return;

    setForm({
      name: selectedCounsel.name,
      scn: selectedCounsel.scn,
      email: selectedCounsel.email,
      callToBarFile: selectedCounsel.callToBarFile
    });
    setFile(selectedCounsel.callToBarFile ?? null);
  }, [selectedCounsel, setFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCounsel) return;

    const { firstName, lastName } = splitName(form.name);

    const payload = {
      ...(form.email && { email: form.email }),
      ...(form.name && { firstName, lastName }),
      ...(form.scn && { scn: form.scn }),
      ...(callToBarFile && { barCertificate: callToBarFile })
    };

    await updateCounsel(selectedCounsel.id, payload);
  };

  // Don't mount the form at all if there's nothing to edit
  if (!selectedCounsel) return null;

  return (
    <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Counsel</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="editName">Full Name</Label>
            <div className="relative">
              <Input
                id="editName"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
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
              value={form.scn}
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
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Call to Bar Certificate */}
          <FileUpload
            id="call-to-bar-upload"
            label="Call to Bar Certificate"
            fileData={callToBarFile}
            onFileChange={setFile}
            accept="application/pdf"
            maxSize={5}
            fileTypeInfo="PDF only. Max 5MB"
          />

          <div className="flex justify-end pt-4 space-x-2">
            <Button type="button" variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCounselModal;
