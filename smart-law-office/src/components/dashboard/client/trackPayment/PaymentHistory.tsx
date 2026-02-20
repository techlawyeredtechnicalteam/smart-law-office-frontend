"use client";
import React, { useEffect, useMemo } from "react";
import useConsultationStore from "@/store/consultationStore";
import { TableModal, TableColumn } from "@/components/shared/TableModal";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ReceiptText,
  MoreHorizontal,
  Eye,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const PaymentHistory = () => {
  const { consultations, fetchConsultations, isLoading } =
    useConsultationStore();

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const historyData = useMemo(() => {
    return consultations.flatMap((c) =>
      (c.transactions || []).map((t) => ({
        ...t,
        service: "Consultation",
        invoiceId: c.code
      }))
    );
  }, [consultations]);

  const columns: TableColumn<any>[] = [
    {
      key: "invoiceId",
      header: "Transaction ID",
      render: (item) => item.invoiceId
    },
    { key: "service", header: "Service", render: (item) => item.service },
    {
      key: "amount",
      header: "Amount",
      render: (item) => `₦${Number(item.amount).toLocaleString()}`
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <Badge
          className={
            item.status === "COMPLETED"
              ? "bg-green-100 text-green-700 hover:bg-green-100"
              : "bg-orange-100 text-orange-700 hover:bg-orange-100"
          }
        >
          {item.status === "COMPLETED" ? "Successful" : "Pending"}
        </Badge>
      )
    },
    {
      key: "createdAt",
      header: "Date",
      render: (item) => new Date(item.createdAt).toLocaleDateString()
    },
    {
      key: "actions",
      header: "",
      render: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => window.open(item.paymentReceipt, "_blank")}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" /> View Receipt
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => {
                // Add your delete logic here
                console.log("Delete transaction:", item.consultTransactionId);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Transaction
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm min-h-[400px]">
      <div className="mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
          <ReceiptText className="h-5 w-5 text-violet-600" /> Billing & Payments
        </h2>
        <p className="text-sm text-gray-500">
          View and track your consultation payment history
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600 mb-2" />
        </div>
      ) : (
        <TableModal
          data={historyData}
          columns={columns}
          emptyMessage="No payment records found."
        />
      )}
    </div>
  );
};

export default PaymentHistory;
