// /components/dashboard/admin/billing/ConfiguredServiceRateTable.tsx
"use client";
import {
  useBillingStore,
  RateEntry,
  ConsultationRate,
  CaseRate
} from "@/store/setRateBill";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";

const ConfiguredServiceRateTable = () => {
  const { rates, openSetRateModal } = useBillingStore();

  const consultationRates = rates.filter(
    (r): r is ConsultationRate => r.serviceType === "Consultation"
  );
  const caseRates = rates.filter(
    (r): r is CaseRate => r.serviceType === "Case"
  );

  // Helper to format currency (assuming Naira ₦ based on mockups)
  const formatCurrency = (amount: number) =>
    `₦${amount.toLocaleString("en-NG")}`;

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="w-[150px]">Consultation Rate</TableHead>
              <TableHead className="w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultationRates.map((rate, index) => (
              <TableRow key={index}>
                <TableCell>Consultation</TableCell>
                <TableCell>{rate.duration}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(rate.rate)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Case Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Case</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Type</TableHead>
              <TableHead>Sub-Service Type</TableHead>
              <TableHead>LPRO Rate</TableHead>
              <TableHead className="w-[150px]">Case Rate</TableHead>
              <TableHead className="w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* The current implementation simplifies sub-service mapping. 
                You would adjust this based on how your store maps the CaseRate object to the full table data. */}
            {caseRates.map((rate, index) => (
              <TableRow key={index}>
                <TableCell>Case</TableCell>
                <TableCell>{rate.subServiceType}</TableCell>
                <TableCell>
                  {/* Mock LPRO rate based on Case type */}
                  {rate.subServiceType.includes("Appeals")
                    ? "600,000 - 800,000"
                    : "300,000 - 500,000"}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(rate.caseRate)}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
};

export default ConfiguredServiceRateTable;
