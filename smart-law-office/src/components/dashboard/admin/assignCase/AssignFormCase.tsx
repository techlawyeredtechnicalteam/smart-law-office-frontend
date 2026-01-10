"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignCaseSchema, AssignCaseSchema } from "@/types/assignCase.schema";
import {
  useAssignStore,
  AssignedCase,
  UnassignedCaseForUI
  // Lawyer
} from "@/store/assignCaseStore";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomSelectField } from "@/components/shared/CustomSelectField";
import { CustomFormField } from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { Lawyer } from "@/types/user";

interface AssignCaseFormProps {
  onSuccess: (assignedCase: AssignedCase) => void;
  onCancel: () => void;
}

export function AssignCaseForm({ onSuccess, onCancel }: AssignCaseFormProps) {
  const {
    unassignedCases,
    counsels,
    assignCase,
    fetchData,
    isLoading,
    isAssigning
  } = useAssignStore();

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const form = useForm<AssignCaseSchema>({
    resolver: zodResolver(assignCaseSchema),
    defaultValues: { clientName: "", caseId: "", counselId: "" }
  });

  // Watch fields to show/hide detail cards dynamically
  const selectedClientName = form.watch("clientName");
  const selectedCaseId = form.watch("caseId");
  const selectedCounselId = form.watch("counselId");

  // Filter cases based on selected client name
  const filteredCases = unassignedCases.filter(
    (c) => !selectedClientName || c.clientName === selectedClientName
  );

  // Find the full objects based on selection
  const selectedCase = unassignedCases.find((c) => c.id === selectedCaseId);
  const selectedLawyer = counsels.find((l) => l.id === selectedCounselId);

  // Reset caseId and counselId when clientName changes
  useEffect(() => {
    form.setValue("caseId", "");
    form.setValue("counselId", "");
  }, [selectedClientName, form]);

  const onSubmit = async (data: AssignCaseSchema) => {
    if (!selectedCase || !selectedLawyer) {
      return;
    }

    // Determine the caseTypeId for the payload
    const mockCaseTypeId = "CT_INTELLECTUAL_PROPERTY";

    const success = await assignCase(
      selectedCase.id,
      selectedLawyer.email,
      mockCaseTypeId,
      selectedCase,
      selectedLawyer
    );

    if (success) {
      const latestAssignedCase = useAssignStore.getState().assignedCases[0];
      form.reset();
      onSuccess(latestAssignedCase);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Loading cases and lawyers...</p>
      </div>
    );
  }

  // Prepare options for select fields
  const clientOptions = Array.from(
    new Set(unassignedCases.map((c) => c.clientName))
  ).map((client) => ({
    label: client,
    value: client
  }));

  const caseOptions = filteredCases.map((c) => ({
    label: `${c.date} - ${c.caseType}`,
    value: c.id
  }));

  const counselOptions = counsels.map((l) => ({
    label: `${l.name} - ${l.specialty}`,
    value: l.id
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Client Name Selection */}
        <CustomFormField
          control={form.control}
          name="clientName"
          label="Client Name"
          placeholder="Input client name here"
          type="text"
          className="bg-white border-gray-300"
        />

        {/* Case Selection */}
        <CustomSelectField
          control={form.control}
          name="caseId"
          label="Select case"
          placeholder="Choose a case to assign"
          options={caseOptions}
          className="bg-white border-gray-300"
        />

        {/* Case Details Card */}
        {selectedCase && <CaseDetailsCard case={selectedCase} />}

        {/* Lawyer Selection */}
        <CustomSelectField
          control={form.control}
          name="counselId"
          label="Select Lawyer"
          placeholder="Choose a lawyer"
          options={counselOptions}
          className="bg-white border-gray-300"
        />

        {/* Lawyer Details Card */}
        {selectedLawyer && <LawyerDetailsCard lawyer={selectedLawyer} />}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={onCancel}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#7C5CFC] hover:bg-[#6B46C1]"
            disabled={isAssigning || !selectedCase || !selectedLawyer}
          >
            {isAssigning ? "Assigning..." : "Assign case"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Extracted Case Details Card Component
function CaseDetailsCard({ case: caseData }: { case: UnassignedCaseForUI }) {
  return (
    <div className="bg-[#EBE7FE] p-4 rounded-lg border border-purple-100 mt-2 space-y-3">
      <h4 className="text-sm font-semibold text-gray-800">Case Details</h4>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-bold text-gray-900">{caseData.id}</p>
          <p className="text-sm font-medium text-gray-700">{caseData.status}</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-200/50 p-2 rounded w-max">
          <FileText size={16} className="text-gray-600" />
          <span className="text-xs font-medium">
            {caseData.contractDoc?.name || "Contract.pdf"}
          </span>
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
  );
}

// Extracted Lawyer Details Card Component
function LawyerDetailsCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 mt-2 space-y-3">
      <h4 className="text-sm font-semibold text-gray-800">
        Lawyer Information
      </h4>
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lawyer.name}`}
          />
          <AvatarFallback>{lawyer.avatar}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-bold text-gray-900">{lawyer.name}</p>
          <p className="text-xs text-gray-500">{lawyer.specialty}</p>
          <p className="text-xs text-gray-400">{lawyer.email}</p>
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
  );
}
