"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Download, Eye, Loader2 } from "lucide-react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TableModal, TableColumn } from "@/components/shared/TableModal"; // Adjust path as needed
import { InvoiceDetails } from "@/types/Invoice.schema";

export function InvoiceDashboard() {
  const {
    invoiceHistory,
    fetchInvoices,
    isLoading,
    setStep,
    setActiveInvoiceId
  } = useInvoiceStore();

  React.useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Dynamic Balance Calculation
  const totalBalance = useMemo(() => {
    return invoiceHistory.reduce(
      (sum, inv) => sum + (Number(inv.consultationFee) || 0),
      0
    );
  }, [invoiceHistory]);

  // CSV Export Logic
  const handleDownloadHistory = () => {
    if (invoiceHistory.length === 0) return;

    const headers = ["Invoice ID,Service,Client,Amount,Status,Date\n"];
    const rows = invoiceHistory.map(
      (inv) =>
        `${inv.invoiceId},${inv.service},${inv.clientName},${inv.consultationFee},${inv.status},${inv.date}`
    );

    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billing_history_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Table Column Configuration
  const columns: TableColumn<InvoiceDetails>[] = [
    {
      key: "invoiceId",
      header: "Invoice ID",
      render: (inv) => <span className="font-medium">{inv.invoiceId}</span>
    },
    {
      key: "service",
      header: "Service",
      render: (inv) => inv.service
    },
    {
      key: "clientName",
      header: "Client",
      render: (inv) => inv.clientName
    },
    {
      key: "amount",
      header: "Amount",
      render: (inv) => `₦${Number(inv.consultationFee).toLocaleString()}`
    },
    {
      key: "notes",
      header: "Invoice Notes",
      render: (inv) => inv.notes
    },
    {
      key: "status",
      header: "Status",
      render: (inv) => (
        <Badge
          variant="secondary"
          className={cn(
            "font-medium",
            inv.status === "Successful" || ""
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          )}
        >
          {inv.status || "Successful"}
        </Badge>
      )
    },
    {
      key: "action",
      header: "Action",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (inv) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setActiveInvoiceId(inv.invoiceId);
            setStep("history");
          }}
        >
          <Eye className="h-4 w-4 text-gray-400" />
        </Button>
      )
    }
  ];

  if (isLoading && invoiceHistory.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-sm text-gray-500">
            Available Balance:{" "}
            <span className="font-bold text-black">
              ₦ {totalBalance.toLocaleString()}
            </span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="text-purple-600 border-purple-200"
          >
            View Rate
          </Button>
          <Button
            onClick={() => setStep("form")}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      {invoiceHistory.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-20 text-center space-y-4 border-dashed">
          <div className="bg-purple-50 p-4 rounded-full">
            <Download className="h-10 w-10 text-purple-300" />
          </div>
          <p className="text-gray-500 max-w-xs">
            You have nothing here yet. Add an invoice to track payments.
          </p>
          <Button onClick={() => setStep("form")} className="bg-purple-600">
            Generate Invoice
          </Button>
        </Card>
      ) : (
        <>
          {/* Monthly Chart Card */}
          <Card className="p-6">
            <h3 className="font-bold mb-4">Monthly Financial Overview</h3>
            <div className="h-40 flex items-end justify-between gap-2 px-4">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
                <div
                  key={month}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className={cn(
                      "w-full rounded-t-md transition-all",
                      month === "Jun"
                        ? "bg-purple-600 h-32"
                        : "bg-purple-100 h-20"
                    )}
                  />
                  <span className="text-xs text-gray-500">{month}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* History Table Card */}
          <Card>
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold">Billing History</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadHistory}
              >
                <Download className="mr-2 h-4 w-4" /> Download History
              </Button>
            </div>
            <TableModal
              data={invoiceHistory}
              columns={columns}
              getRowKey={(item) => item.invoiceId}
              containerClassName="bg-white"
            />
          </Card>
        </>
      )}
    </div>
  );
}
