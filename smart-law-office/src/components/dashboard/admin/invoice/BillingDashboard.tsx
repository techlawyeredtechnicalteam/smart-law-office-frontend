"use client";

import React, { useMemo } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableModal, TableColumn } from "@/components/shared/TableModal";
import { InvoiceDetails } from "@/types/Invoice.schema";

export function InvoiceDashboard() {
  const { invoiceHistory, fetchInvoices, setStep, setActiveInvoiceId } =
    useInvoiceStore();

  React.useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const availableBalance = useMemo(() => {
    return invoiceHistory.reduce(
      (acc, inv) => acc + (Number(inv.consultationFee) || 0),
      0
    );
  }, [invoiceHistory]);

  const currentMonthTotal = useMemo(() => {
    const now = new Date();
    const currentMonthInvoices = invoiceHistory.filter((inv) => {
      const invDate = new Date(inv.date);
      return (
        invDate.getMonth() === now.getMonth() &&
        invDate.getFullYear() === now.getFullYear()
      );
    });
    return currentMonthInvoices.reduce(
      (acc, inv) => acc + (Number(inv.consultationFee) || 0),
      0
    );
  }, [invoiceHistory]);

  const columns: TableColumn<InvoiceDetails>[] = [
    {
      key: "invoiceId",
      header: "Invoice ID",
      render: (inv) => (
        <span className="text-gray-500 font-mono text-xs">
          {inv.invoiceId.slice(0, 5)}
        </span>
      )
    },
    {
      key: "service",
      header: "Service Type",
      render: (inv) => (
        <div className="flex items-center gap-2">
          {inv.service === "Case" ? (
            <Briefcase className="h-4 w-4 text-blue-500" />
          ) : (
            <FileText className="h-4 w-4 text-purple-500" />
          )}
          <span className="font-medium">{inv.service}</span>
        </div>
      )
    },
    {
      key: "clientName",
      header: "Client Name",
      render: (inv) => (
        <span className="text-gray-700 font-medium">{inv.clientName}</span>
      )
    },
    // {
    //   key: "amount",
    //   header: "Amount",
    //   render: (inv) => (
    //     <span className="font-bold text-gray-900">
    //       ₦ {Number(inv.consultationFee || 0).toLocaleString()}
    //     </span>
    //   )
    // },
    // {
    //   key: "status",
    //   header: "Status",
    //   render: (inv) => (
    //     <Badge
    //       className={cn(
    //         "rounded-full px-3 py-1 font-normal border shadow-none",
    //         inv.status === "Successful"
    //           ? "bg-green-50 text-green-600 border-green-200"
    //           : "bg-orange-50 text-orange-600 border-orange-200"
    //       )}
    //     >
    //       {inv.status}
    //     </Badge>
    //   )
    // },
    {
      key: "date",
      header: "Date",
      render: (inv) => <span className="text-gray-500">{inv.date}</span>
    },
    {
      key: "action",
      header: "",
      render: (inv) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setActiveInvoiceId(inv.invoiceId);
            setStep("history");
          }}
        >
          <span className="text-xl font-bold text-gray-400">...</span>
        </Button>
      )
    }
  ];

  return (
    <div className="p-8 bg-[#FDFDFF] min-h-screen space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Billing</h1>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Available Balance
            </p>
            <p className="text-3xl font-bold mt-1">
              ₦ {availableBalance.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="text-purple-600 hover:bg-purple-50"
          >
            View Rate
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700 rounded-lg px-6"
            onClick={() => setStep("form")}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      <Card className="p-6 border-none shadow-sm rounded-2xl">
        <h3 className="font-bold text-gray-800 mb-2">
          Monthly Financial Overview
        </h3>
        <div className="flex items-baseline gap-2 mb-8">
          <span className="text-xl font-bold">
            ₦ {currentMonthTotal.toLocaleString()}
          </span>
          <span className="text-xs text-green-600 font-medium flex items-center">
            <span className="mr-1">▲</span> 2.5% in the last 6 months
          </span>
        </div>

        <div className="h-44 flex items-end justify-between gap-4">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
            <div
              key={month}
              className="flex-1 flex flex-col items-center gap-3 group relative"
            >
              {month === "Jun" && (
                <div className="absolute -top-10 bg-white border shadow-md px-3 py-1 rounded-md text-xs font-bold">
                  {currentMonthTotal.toLocaleString()}
                  <div className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-white" />
                </div>
              )}
              <div
                className={cn(
                  "w-full rounded-2xl transition-all duration-500",
                  month === "Jun" ? "bg-purple-600 h-40" : "bg-purple-50 h-24"
                )}
              />
              <span className="text-sm text-gray-400 font-medium">{month}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b bg-white">
          <h3 className="font-bold">Billing History</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-purple-600 border-purple-200"
            >
              Track Payment
            </Button>
            <Button className="bg-purple-50 text-purple-600 hover:bg-purple-100 border-none">
              Download Billing History
            </Button>
          </div>
        </div>
        <TableModal
          data={invoiceHistory}
          columns={columns}
          getRowKey={(inv) => inv.invoiceId}
          containerClassName="px-4 pb-4"
        />
      </Card>
    </div>
  );
}
