"use client";
import {
  CaseRate,
  ConsultationRate,
  useBillingStore
} from "@/store/setRateBill";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { TableModal, TableColumn } from "@/components/shared/TableModal";
import { useRouter } from "next/navigation";

const ConfiguredServiceRateTable = () => {
  const router = useRouter();
  const { rates, openSetRateModal, feeSchedules } = useBillingStore();

  // Type-safe filters for the two tables
  const consultationRates = rates.filter(
    (r): r is ConsultationRate => r.serviceType === "Consultation"
  );
  const caseRates = rates.filter(
    (r): r is CaseRate => r.serviceType === "Case"
  );

  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG")}`;

  // Helper to get LPRO range from feeSchedules if available
  const getLproRange = (subServiceType: string) => {
    const schedule = feeSchedules.find(
      (f) => (f.name || f.feeScheduleName) === subServiceType
    );
    if (schedule) {
      return `${schedule.rateMin.toLocaleString()} - ${schedule.rateMax.toLocaleString()}`;
    }
    // Fallback to your logic if schedule not found
    return subServiceType?.includes("Appeals")
      ? "600,000 - 800,000"
      : "300,000 - 500,000";
  };
  // Consultation Table Columns
  const consultationColumns: TableColumn<ConsultationRate>[] = [
    {
      key: "serviceType",
      header: "Service Type",
      render: () => "Consultation"
    },

    {
      key: "duration",
      header: "Duration",
      render: (rate) => rate.duration
    },
    {
      key: "rate",
      header: "Consultation Rate",
      render: (rate) => formatCurrency(rate.rate),
      cellClassName: "font-medium text-violet-700"
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: "w-[80px]",
      render: () => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  // Case Table Columns
  const caseColumns: TableColumn<CaseRate>[] = [
    {
      key: "subServiceType",
      header: "Sub-Service Type",
      render: (rate) => rate.subServiceType || "Standard Case"
    },
    {
      key: "lproRate",
      header: "LPRO Rate (Ref)",
      render: (rate) => `₦${getLproRange(rate.subServiceType)}`
    },
    {
      key: "caseRate",
      header: "Set Case Rate",
      render: (rate) => formatCurrency(rate.caseRate),
      cellClassName: "font-medium text-violet-700"
    },
    {
      key: "actions",
      header: "Action",
      headerClassName: "w-[80px]",
      render: () => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Configured Service Rate
          </h1>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none">
            View Billing
          </Button>
          <Button
            onClick={openSetRateModal}
            className="bg-violet-600 hover:bg-violet-700 flex-1 sm:flex-none"
          >
            Set Rate
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        {/* Consultation Section */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Consultation Rates
            </h2>
            <p className="text-sm text-gray-500">
              Fixed rates for timed sessions
            </p>
          </div>
          <TableModal
            data={consultationRates}
            columns={consultationColumns}
            emptyMessage="No consultation rates configured"
            getRowKey={(_, index) => `consultation-${index}`}
          />
        </section>

        {/* Case Section */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Case Rates</h2>
            <p className="text-sm text-gray-500">Fixed rates per case type</p>
          </div>
          <TableModal
            data={caseRates}
            columns={caseColumns}
            emptyMessage="No case rates configured"
            getRowKey={(_, index) => `case-${index}`}
          />
        </section>
      </div>
    </div>
  );
};

export default ConfiguredServiceRateTable;
