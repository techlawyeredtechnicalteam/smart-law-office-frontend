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
import { Briefcase, Calendar, FileText, User } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { CustomSelectField } from "@/components/shared/CustomSelectField";
import { CustomFormField } from "@/components/shared/CustomFormField";
import { Form } from "@/components/ui/form";
import { Lawyer } from "@/types/user";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

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
  const { consultations, fetchConsultations } = useConsultationStore();

  // Load consultations if empty
  useEffect(() => {
    if (consultations.length === 0) {
      fetchConsultations();
    }
  }, [consultations.length, fetchConsultations]);

  // Data is already fetched by the parent page, no need to fetch again

  const form = useForm<AssignCaseSchema>({
    resolver: zodResolver(assignCaseSchema),
    defaultValues: { clientName: "", caseId: "", counselId: "" }
  });

  // Watch fields to show/hide detail cards dynamically
  const selectedClientName = form.watch("clientName");
  const selectedCaseId = form.watch("caseId");
  const selectedCounselId = form.watch("counselId");
  const lastClientRef = useRef("");

  // 1. Client options from consultations (those who have booked)
  const clientOptions = useMemo(() => {
    const uniqueClients = Array.from(
      new Set(consultations.map((c) => (c as any).clientName || "Unknown"))
    );
    return uniqueClients.map((name) => ({
      label: name,
      value: name
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

  // Lookups
  const selectedCase = unassignedCases.find((c) => c.id === selectedCaseId);
  const selectedLawyer = counsels.find(
    (l) => l.id === selectedCounselId || l.email === selectedCounselId
  );
  const selectedConsultation = consultations.find(
    (c) => (c as any).clientName === selectedClientName
  );

  const onSubmit = async (data: AssignCaseSchema) => {
    if (!selectedCase || !selectedLawyer || !selectedConsultation) {
      toast.error("Please ensure a client, case, and lawyer are selected");
      return;
    }

    try {
      // Use the actual 'id' or 'code' from the consultation object
      const consultId = selectedConsultation.id;

      const success = await assignCase(
        consultId,
        selectedLawyer.email,
        selectedCase.id,
        selectedCase,
        selectedLawyer
      );

      if (success) {
        toast.success("Case assigned successfully!");
        const latest = useAssignStore.getState().assignedCases[0];
        onSuccess(latest);
        form.reset();
      }
    } catch (error) {
      toast.error("Failed to assign case.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {isLoading ? (
          <div className="flex justify-center p-8 text-slate-500 animate-pulse">
            Fetching association data...
          </div>
        ) : (
          <>
            <CustomSelectField
              control={form.control}
              name="clientName"
              label="1. Select Client"
              placeholder="Search by name..."
              options={clientOptions}
            />

            {selectedConsultation && (
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-purple-900">
                    Consultation Reference: {selectedConsultation.id}
                  </p>
                  <p className="text-purple-700 mt-1">
                    {selectedConsultation.consultAt
                      ? format(
                          parseISO(selectedConsultation.consultAt),
                          "PPP p"
                        )
                      : "Date not specified"}
                  </p>
                </div>
              </div>
            )}

            <CustomSelectField
              control={form.control}
              name="caseId"
              label="2. Assign to Case"
              placeholder={
                selectedClientName
                  ? "Choose unassigned case"
                  : "Select client first"
              }
              options={caseOptions}
              disabled={!selectedClientName}
            />

            {selectedCase && <CaseDetailsCard case={selectedCase} />}

            <CustomSelectField
              control={form.control}
              name="counselId"
              label="3. Assign Lawyer"
              placeholder="Assign counsel..."
              options={counselOptions}
            />

            {selectedLawyer && <LawyerDetailsCard lawyer={selectedLawyer} />}

            <div className="flex gap-3 pt-6 border-t mt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#7C5CFC] hover:bg-[#6B46C1] text-white font-bold shadow-lg shadow-purple-100"
                disabled={isAssigning || !selectedCase || !selectedLawyer}
              >
                {isAssigning ? "Processing..." : "Confirm Assignment"}
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
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center gap-2 mb-2 text-slate-400">
        <Briefcase className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          Active Unassigned Case
        </span>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-black text-slate-900">
            {caseData.caseType}
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            ID: {caseData.id}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <FileText size={14} className="text-purple-600" />
          <span className="text-[11px] font-bold text-slate-600 truncate max-w-[100px]">
            {caseData.contractDoc?.name || "Contract.pdf"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Extracted Lawyer Details Card Component
function LawyerDetailsCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl text-white shadow-xl animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-2 mb-3 text-slate-400">
        <User className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          Primary Counsel Assigned
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center font-bold text-lg">
          {lawyer.name?.charAt(0) || "L"}
        </div>
        <div>
          <p className="text-sm font-bold leading-none">{lawyer.name}</p>
          <p className="text-[11px] text-purple-400 mt-1">
            {lawyer.specialty || "Legal Expert"}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{lawyer.email}</p>
        </div>
      </div>
    </div>
    // <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 mt-2 space-y-3">
    //   <h4 className="text-sm font-semibold text-gray-800">
    //     Lawyer Information
    //   </h4>
    //   <div className="flex items-start gap-3">
    //     <div>
    //       <p className="text-sm font-bold text-gray-900">
    //         {lawyer.name || "Unknown"}
    //       </p>
    //       <p className="text-xs text-gray-500">
    //         {lawyer.specialty || "General Practice"}
    //       </p>
    //       <p className="text-xs text-gray-400">{lawyer.email}</p>
    //     </div>
    //   </div>
    //   {/* <Button
    //     type="button"
    //     variant="ghost"
    //     className="w-full bg-[#D6CFFC] text-purple-700 hover:bg-[#C4B8FA] h-8 text-xs font-bold"
    //   >
    //     Open
    //   </Button> */}
    // </div>
  );
}
