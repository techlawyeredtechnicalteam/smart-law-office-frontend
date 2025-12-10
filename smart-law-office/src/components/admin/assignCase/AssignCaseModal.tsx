"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignCaseSchema, AssignCaseSchema } from "@/lib/assignCase.schema";
import { useAssignStore } from "@/store/assignCaseStore";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/shared/ui/select";
import { Button } from "@/components/shared/ui/button";
import { FileText, User } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/shared/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/shared/ui/dialog";

export function AssignCaseModal() {
  const [open, setOpen] = useState(false);
  const { unassignedCases, counsels, assignCase } = useAssignStore();

  const form = useForm<AssignCaseSchema>({
    resolver: zodResolver(assignCaseSchema),
    defaultValues: { clientName: "", caseId: "", counselId: "" }
  });

  // Watch fields to show/hide detail cards dynamically
  const selectedCaseId = form.watch("caseId");
  const selectedCounselId = form.watch("counselId");

  // Find the full objects based on selection
  const selectedCase = unassignedCases.find((c) => c.id === selectedCaseId);
  const selectedLawyer = counsels.find((l) => l.id === selectedCounselId);

  const onSubmit = (data: AssignCaseSchema) => {
    assignCase(data.caseId, data.counselId);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#7C5CFC] hover:bg-[#6B46C1]">
          + Assign Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-50/50 p-6 rounded-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold">Assign Case</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* 1. Client Name Selection */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-purple-600 ml-1">
              Client Name
            </label>
            <Select onValueChange={(val) => form.setValue("clientName", val)}>
              <SelectTrigger className="bg-white border-purple-200">
                <SelectValue placeholder="Input client name here" />
              </SelectTrigger>
              <SelectContent>
                {/* Get unique client names */}
                {Array.from(
                  new Set(unassignedCases.map((c) => c.clientName))
                ).map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. Case Selection */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-purple-600 ml-1">
              Select case
            </label>
            <Select onValueChange={(val) => form.setValue("caseId", val)}>
              <SelectTrigger className="bg-white border-purple-200">
                <SelectValue placeholder="Choose a case to assign" />
              </SelectTrigger>
              <SelectContent>
                {unassignedCases.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.date} - {c.id} - {c.caseType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2a. Case Details Card (Conditional Render - assign4.png) */}
          {selectedCase && (
            <div className="bg-[#EBE7FE] p-4 rounded-lg border border-purple-100 mt-2 space-y-3">
              <h4 className="text-sm font-semibold text-gray-800">
                Case Details
              </h4>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {selectedCase.id}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {selectedCase.status}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-gray-200/50 p-2 rounded w-max">
                <FileText size={16} className="text-gray-600" />
                <span className="text-xs font-medium">
                  {selectedCase.contractDoc?.name || "Contract.pdf"}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-full bg-[#D6CFFC] text-purple-700 hover:bg-[#C4B8FA] h-8 text-xs font-bold"
              >
                Open
              </Button>
            </div>
          )}

          {/* 3. Lawyer Selection */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-purple-600 ml-1">
              Select Lawyer
            </label>
            <Select onValueChange={(val) => form.setValue("counselId", val)}>
              <SelectTrigger className="bg-white border-purple-200">
                <SelectValue placeholder="Choose a lawyer" />
              </SelectTrigger>
              <SelectContent>
                {counsels.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name} - {l.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 3a. Lawyer Details Card (Conditional Render - assign5.png) */}
          {selectedLawyer && (
            <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 mt-2 space-y-3">
              <h4 className="text-sm font-semibold text-gray-800">
                Lawyer Information
              </h4>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedLawyer.name}`}
                  />
                  <AvatarFallback>{selectedLawyer.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedLawyer.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedLawyer.specialty}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedLawyer.email}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-full bg-[#D6CFFC] text-purple-700 hover:bg-[#C4B8FA] h-8 text-xs font-bold"
              >
                Open
              </Button>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#7C5CFC] hover:bg-[#6B46C1]"
            >
              Assign case
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
