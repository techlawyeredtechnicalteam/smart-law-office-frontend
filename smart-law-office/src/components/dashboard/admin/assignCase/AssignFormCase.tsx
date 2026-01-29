"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignCaseSchema, AssignCaseSchema } from "@/types/assignCase.schema";
import {
  useAssignStore,
  AssignedCase,
  UnassignedCaseForUI
} from "@/store/assignCaseStore";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, User } from "lucide-react";
import { useEffect, useMemo } from "react";
import { CustomSelectField } from "@/components/shared/CustomSelectField";
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

  // Load data if store is empty
  useEffect(() => {
    if (unassignedCases.length === 0) fetchData();
  }, [unassignedCases.length, fetchData]);

  const form = useForm<AssignCaseSchema>({
    resolver: zodResolver(assignCaseSchema),
    defaultValues: { clientName: "", caseId: "", counselId: "" }
  });

  // Watch selected values from the form state
  const selectedConsultCode = form.watch("clientName");
  const selectedCaseId = form.watch("caseId");
  const selectedCounselEmail = form.watch("counselId");

  // 1. Client Options - Value MUST be the consultCode for the API
  const clientOptions = useMemo(() => {
    return unassignedCases.map((c) => ({
      label: c.clientName,
      value: c.consultCode // This is what the backend wants (e.g., "M0BVHZ")
    }));
  }, [unassignedCases]);

  // 2. Lookup the full object based on the watched code
  const selectedConsultation = useMemo(
    () => unassignedCases.find((c) => c.consultCode === selectedConsultCode),
    [unassignedCases, selectedConsultCode]
  );

  // 3. Case Options - Automatically populated once a client is picked
  const caseOptions = useMemo(() => {
    if (!selectedConsultation) return [];
    return [
      {
        label: `${selectedConsultation.consultCode} - ${selectedConsultation.caseType}`,
        value: selectedConsultation.id
      }
    ];
  }, [selectedConsultation]);

  // 4. Lawyer Options - Value is email as required by assignCase API
  const counselOptions = useMemo(() => {
    return (counsels || []).map((l) => ({
      label: `${l.name} - ${l.specialty}`,
      value: l.email
    }));
  }, [counsels]);

  // Auto-select the case when a client is chosen
  useEffect(() => {
    if (selectedConsultation) {
      form.setValue("caseId", selectedConsultation.id);
    } else {
      form.setValue("caseId", "");
    }
  }, [selectedConsultation, form]);

  const onSubmit = async (data: AssignCaseSchema) => {
    const selectedLawyer = counsels.find((l) => l.email === data.counselId);

    if (!selectedConsultation || !selectedLawyer) {
      toast.error("Invalid selection data. Please try again.");
      return;
    }

    try {
      const success = await assignCase(
        selectedConsultation.consultCode, // string
        selectedLawyer.email, // string
        selectedConsultation.id, // string
        selectedConsultation, // UnassignedCaseForUI
        selectedLawyer // Lawyer
      );

      if (success) {
        toast.success("Case assigned successfully!");
        // Grab the most recent assignment from the store
        const lastAssigned = useAssignStore.getState().assignedCases[0];
        onSuccess(lastAssigned);
        form.reset();
      }
    } catch (error) {
      toast.error("Server rejected the assignment.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {isLoading ? (
          <div className="flex justify-center p-8 text-slate-500 animate-pulse">
            Fetching data...
          </div>
        ) : (
          <>
            {/* 1. SELECT CLIENT */}
            <CustomSelectField
              control={form.control}
              name="clientName"
              label="1. Select Client Consultation"
              placeholder="Search by name..."
              options={clientOptions}
            />

            {selectedConsultation && (
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
                <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-purple-900">
                    Consultation Code: {selectedConsultation.consultCode}
                  </p>
                  <p className="text-purple-700 mt-1">
                    Status: {selectedConsultation.status}
                  </p>
                </div>
              </div>
            )}

            {/* 2. SELECT CASE (AUTO-FILLED) */}
            <CustomSelectField
              control={form.control}
              name="caseId"
              label="2. Case Reference"
              placeholder={
                selectedConsultCode ? "Case identified" : "Select client first"
              }
              options={caseOptions}
              disabled={!selectedConsultCode}
            />

            {selectedConsultation && (
              <CaseDetailsCard case={selectedConsultation} />
            )}

            {/* 3. SELECT LAWYER */}
            <CustomSelectField
              control={form.control}
              name="counselId"
              label="3. Assign Lawyer"
              placeholder="Assign counsel..."
              options={counselOptions}
            />

            {selectedCounselEmail &&
              counsels.find((l) => l.email === selectedCounselEmail) && (
                <LawyerDetailsCard
                  lawyer={
                    counsels.find((l) => l.email === selectedCounselEmail)!
                  }
                />
              )}

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
                className="flex-1 bg-[#7C5CFC] hover:bg-[#6B46C1] text-white font-bold"
                disabled={
                  isAssigning || !selectedConsultCode || !selectedCounselEmail
                }
              >
                {isAssigning ? "Assigning..." : "Confirm Assignment"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}

function CaseDetailsCard({ case: caseData }: { case: UnassignedCaseForUI }) {
  return (
    <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 animate-in fade-in zoom-in-95">
      <div className="flex items-center gap-2 mb-2 text-violet-400">
        <Briefcase className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          Consultation Details
        </span>
      </div>
      <p className="text-sm font-black text-slate-900">{caseData.caseType}</p>
      <p className="text-[11px] text-violet-500 font-mono font-bold uppercase mt-1">
        CODE: {caseData.consultCode}
      </p>
    </div>
  );
}

function LawyerDetailsCard({ lawyer }: { lawyer: Lawyer }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl text-white shadow-xl animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
          {lawyer.name?.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold leading-none">{lawyer.name}</p>
          <p className="text-[11px] text-purple-400 mt-1">{lawyer.specialty}</p>
          <p className="text-[10px] text-slate-400">{lawyer.email}</p>
        </div>
      </div>
    </div>
  );
}
