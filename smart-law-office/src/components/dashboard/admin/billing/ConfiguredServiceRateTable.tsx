"use client";
import {
  useBillingStore,
  ConsultationRate,
  CaseRate
} from "@/store/setRateBill";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { TableModal, TableColumn } from "@/components/shared/TableModal";

const ConfiguredServiceRateTable = () => {
  const { rates, openSetRateModal } = useBillingStore();

  const consultationRates = rates.filter(
    (r): r is ConsultationRate => r.serviceType === "Consultation"
  );
  const caseRates = rates.filter(
    (r): r is CaseRate => r.serviceType === "Case"
  );

  // Helper to format currency
  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG")}`;

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
      cellClassName: "font-medium",
      headerClassName: "w-[150px]"
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
    // {
    //   key: "serviceType",
    //   header: "Service Type",
    //   render: () => "Case"
    // },
    {
      key: "subServiceType",
      header: "Sub-Service Type",
      render: (rate) => rate.subServiceType || "N/A" // Fallback if missing
    },
    {
      key: "subServiceType",
      header: "Sub-Service Type",
      render: (rate) => rate.subServiceType
    },
    // {
    //   key: "lproRate",
    //   header: "LPRO Rate",
    //   render: (rate) =>
    //     rate.subServiceType.includes("Appeals")
    //       ? "600,000 - 800,000"
    //       : "300,000 - 500,000"
    // },
    {
      key: "lproRate",
      header: "LPRO Rate",
      render: (rate) =>
        // Use optional chaining here to prevent the crash
        rate.subServiceType?.includes("Appeals")
          ? "600,000 - 800,000"
          : "300,000 - 500,000"
    },
    {
      key: "caseRate",
      header: "Case Rate",
      render: (rate) => formatCurrency(rate.caseRate),
      cellClassName: "font-medium",
      headerClassName: "w-[150px]"
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

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
      {/* Table Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Configured Service Rate</h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">View Billing</Button>
          <Button
            onClick={openSetRateModal}
            className="bg-violet-600 hover:bg-violet-700"
          >
            Set Rate
          </Button>
        </div>
      </div>

      {/* Consultation Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Consultation
        </h2>
        <TableModal
          data={consultationRates}
          columns={consultationColumns}
          emptyMessage="No consultation rates configured"
          getRowKey={(rate, index) => `consultation-${index}`}
        />
      </section>

      {/* Case Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Case</h2>
        <TableModal
          data={caseRates}
          columns={caseColumns}
          emptyMessage="No case rates configured"
          getRowKey={(rate, index) => `case-${index}`}
        />
      </section>
    </div>
  );
};

export default ConfiguredServiceRateTable;
