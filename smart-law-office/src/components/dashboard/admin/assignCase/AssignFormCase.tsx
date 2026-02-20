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
import { Briefcase, Calendar } from "lucide-react";
import { useEffect, useMemo } from "react";
import { CustomSelectField } from "@/components/shared/CustomSelectField";
import { Form } from "@/components/ui/form";
import { Lawyer } from "@/types/user";
import { toast } from "sonner";
import { useCounselStore } from "@/store/manageCounsel";

interface AssignCaseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AssignCaseForm({ onSuccess, onCancel }: AssignCaseFormProps) {
  const { counsel: masterCounsels, fetchCounsels } = useCounselStore();
  const {
    unassignedCases,
    fetchUnassigned,
    assignCase,
    isLoading,
    isAssigning
  } = useAssignStore();

  useEffect(() => {
    if (unassignedCases.length === 0) fetchUnassigned();
    if (masterCounsels.length === 0) fetchCounsels();
  }, [fetchUnassigned, fetchCounsels]); // stable store refs, not lengths

  const form = useForm<AssignCaseSchema>({
    resolver: zodResolver(assignCaseSchema),
    defaultValues: { clientName: "", caseId: "", counselId: "" }
  });

  const selectedConsultCode = form.watch("clientName");
  const selectedCounselEmail = form.watch("counselId");

  // Derived values — looked up once, reused everywhere
  const selectedConsultation = useMemo(
    () =>
      unassignedCases.find((c) => c.consultCode === selectedConsultCode) ??
      null,
    [unassignedCases, selectedConsultCode]
  );

  const selectedLawyer = useMemo(
    () => masterCounsels.find((l) => l.email === selectedCounselEmail) ?? null,
    [masterCounsels, selectedCounselEmail]
  );

  // Options
  const clientOptions = useMemo(
    () =>
      unassignedCases.map((c) => ({
        label: c.clientName,
        value: c.consultCode
      })),
    [unassignedCases]
  );

  const caseOptions = useMemo(
    () =>
      selectedConsultation
        ? [
            {
              label: `${selectedConsultation.consultCode} - ${selectedConsultation.caseType}`,
              value: selectedConsultation.id
            }
          ]
        : [],
    [selectedConsultation]
  );

  const counselOptions = useMemo(
    () =>
      masterCounsels.map((l) => ({
        label: `${l.name} - ${l.specialty}`,
        value: l.email
      })),
    [masterCounsels]
  );

  useEffect(() => {
    form.setValue("caseId", selectedConsultation?.id ?? "");
  }, [selectedConsultation, form]);

  const onSubmit = async (data: AssignCaseSchema) => {
    if (!selectedConsultation || !selectedLawyer) {
      toast.error("Invalid selection. Please try again.");
      return;
    }

    const success = await assignCase(
      selectedConsultation.consultCode,
      selectedLawyer.email,
      selectedConsultation.id,
      selectedConsultation,
      selectedLawyer
    );

    if (success) {
      toast.success("Case assigned successfully!");
      form.reset();
      onSuccess();
    } else {
      toast.error("Assignment failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 text-slate-500 animate-pulse">
        Fetching data...
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* 1. SELECT CLIENT */}
        <CustomSelectField
          control={form.control}
          name="clientName"
          label="1. Select Client Consultation"
          placeholder="Search by name..."
          options={clientOptions}
        />

        {selectedConsultation && (
          <ConsultationBadge consultation={selectedConsultation} />
        )}

        {/* 2. CASE REFERENCE (auto-filled) */}
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
          <CaseDetailsCard caseData={selectedConsultation} />
        )}

        {/* 3. ASSIGN LAWYER */}
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
            className="flex-1 bg-[#7C5CFC] hover:bg-[#6B46C1] text-white font-bold"
            disabled={
              isAssigning || !selectedConsultCode || !selectedCounselEmail
            }
          >
            {isAssigning ? "Assigning..." : "Confirm Assignment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function ConsultationBadge({
  consultation
}: {
  consultation: UnassignedCaseForUI;
}) {
  return (
    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
      <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
      <div className="text-xs">
        <p className="font-bold text-purple-900">
          Consultation Code: {consultation.consultCode}
        </p>
        <p className="text-purple-700 mt-1">Status: {consultation.status}</p>
      </div>
    </div>
  );
}

function CaseDetailsCard({ caseData }: { caseData: UnassignedCaseForUI }) {
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
