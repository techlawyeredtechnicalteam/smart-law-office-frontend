"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignCaseSchema, AssignCaseSchema } from "@/types/assignCase.schema";
import {
  useAssignStore,
  AssignedCase,
  UnassignedCaseForUI
} from "@/store/assignCaseStore";
import useConsultationStore from "@/store/consultationStore";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { CustomSelectField } from "@/components/shared/CustomSelectField";
import { CustomFormField } from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { Lawyer } from "@/types/user";
import { toast } from "sonner";

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

  // Get consultations to select from
  const { consultations } = useConsultationStore();

  // Data is already fetched by the parent page, no need to fetch again

  const form = useForm<AssignCaseSchema>({
    resolver: zodResolver(assignCaseSchema),
    defaultValues: { clientName: "", caseId: "", counselId: "" }
  });

  // Watch fields to show/hide detail cards dynamically
  const selectedClientName = form.watch("clientName");
  const selectedCaseId = form.watch("caseId");
  const selectedCounselId = form.watch("counselId");

  // Prevent infinite loops by tracking the last client seen
  const lastClientRef = useRef("");

  // 1. Client options from consultations (those who have booked)
  const clientOptions = useMemo(() => {
    return consultations.map((c) => ({
      label: c.clientName,
      value: c.clientName
    }));
  }, [consultations]);

  // 2. Filter cases: ONLY show cases belonging to the selected client
  const caseOptions = useMemo(() => {
    if (!selectedClientName) return [];
    return unassignedCases
      .filter(
        (c) =>
          c.clientName === selectedClientName ||
          !c.clientName ||
          c.clientName === "Pending Assignment"
      )
      .map((c) => ({
        label: `${c.caseType} (${c.id.slice(-5)})`,
        value: c.id
      }));
  }, [unassignedCases, selectedClientName]);

  // 3. Reset Case ID only if the client actually changes
  useEffect(() => {
    if (selectedClientName !== lastClientRef.current) {
      form.setValue("caseId", "");
      lastClientRef.current = selectedClientName;
    }
  }, [selectedClientName, form]);

  const counselOptions = useMemo(() => {
    return (counsels || []).map((l) => ({
      label: `${l.name || "Unknown"} - ${l.specialty || "General Practice"}`,
      value: l.id || l.email
    }));
  }, [counsels]);

  const selectedCase = unassignedCases.find((c) => c.id === selectedCaseId);
  const selectedLawyer = counsels.find(
    (l) => l.id === selectedCounselId || l.email === selectedCounselId
  );
  const selectedConsultation = consultations.find(
    (c) => c.clientName === selectedClientName
  );

  const onSubmit = async (data: AssignCaseSchema) => {
    if (!selectedCase || !selectedLawyer || !selectedConsultation) {
      toast.error("Please ensure a client, case, and lawyer are selected");
      return;
    }

    const consultCode = selectedConsultation.consultationId;
    const success = await assignCase(
      consultCode,
      selectedLawyer.email,
      selectedCase.id,
      selectedCase,
      selectedLawyer
    );

    if (success) {
      const latestAssignedCase = useAssignStore.getState().assignedCases[0];
      form.reset();
      toast.success("Case assigned successfully!");
      onSuccess(latestAssignedCase);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-sm text-slate-500">
              Loading billing and staff data...
            </p>
          </div>
        ) : (
          <>
            <CustomSelectField
              control={form.control}
              name="clientName"
              label="Client Name"
              placeholder="Select client with booked consultation"
              options={clientOptions}
              className="bg-white border-gray-300 w-full"
            />

            {selectedConsultation && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                <p className="font-bold text-blue-900">
                  Consultation ID: {selectedConsultation.consultationId}
                </p>
                <p className="text-blue-700">
                  {selectedConsultation.meetingDate} |{" "}
                  {selectedConsultation.meetingTime}
                </p>
              </div>
            )}

            <CustomSelectField
              control={form.control}
              name="caseId"
              label="Select Case"
              placeholder={
                selectedClientName ? "Choose case" : "Select a client first"
              }
              options={caseOptions}
              className="w-full"
              // disabled={!selectedClientName}
            />

            {selectedCase && <CaseDetailsCard case={selectedCase} />}

            <CustomSelectField
              control={form.control}
              name="counselId"
              label="Select Lawyer"
              placeholder="Choose a lawyer"
              options={counselOptions}
              className="bg-white border-gray-300 w-full"
            />

            {selectedLawyer && <LawyerDetailsCard lawyer={selectedLawyer} />}

            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={onCancel}
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
          </>
        )}
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
      {/* <Button
        type="button"
        variant="ghost"
        className="w-full bg-[#D6CFFC] text-purple-700 hover:bg-[#C4B8FA] h-8 text-xs font-bold"
      >
        Open
      </Button> */}
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
        <div>
          <p className="text-sm font-bold text-gray-900">
            {lawyer.name || "Unknown"}
          </p>
          <p className="text-xs text-gray-500">
            {lawyer.specialty || "General Practice"}
          </p>
          <p className="text-xs text-gray-400">{lawyer.email}</p>
        </div>
      </div>
      {/* <Button
        type="button"
        variant="ghost"
        className="w-full bg-[#D6CFFC] text-purple-700 hover:bg-[#C4B8FA] h-8 text-xs font-bold"
      >
        Open
      </Button> */}
    </div>
  );
}
