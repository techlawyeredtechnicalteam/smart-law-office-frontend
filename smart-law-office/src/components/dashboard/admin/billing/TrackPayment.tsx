"use client";
import React, { useEffect, useMemo } from "react";
import useConsultationStore from "@/store/consultationStore";
import { TableModal, TableColumn } from "@/components/shared/TableModal";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Download,
  Eye,
  CheckCircle,
  Trash2,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const TrackPayment = () => {
  const { consultations, fetchConsultationDirect, isLoading } =
    useConsultationStore();

  useEffect(() => {
    fetchConsultationDirect();
  }, []);

  // Flatten consultations into a list of transactions for the billing table
  const tableData = useMemo(() => {
    return consultations.flatMap((c) =>
      c.transactions.map((t) => ({
        ...t,
        clientName: c.clientName,
        service: "Consultation",
        invoiceId: c.code
      }))
    );
  }, [consultations]);

  // const handleConfirm = async (id: string) => {
  //   const success = await confirmPayment(id);
  //   if (success) toast.success("Payment verified successfully");
  // };

  const columns: TableColumn<any>[] = [
    {
      key: "invoiceId",
      header: "Invoice ID",
      render: (item) => item.invoiceId
    },
    { key: "service", header: "Service", render: (item) => item.service },
    {
      key: "clientName",
      header: "Client name",
      render: (item) => item.clientName
    },
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
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => window.open(item.paymentReceipt, "_blank")}
            >
              <Eye className="mr-2 h-4 w-4" /> View Receipt
            </DropdownMenuItem>

            {/* Show Confirm button only if PENDING */}
            {item.status !== "COMPLETED" && (
              <DropdownMenuItem
                // onClick={() => handleConfirm(item.consultTransactionId)}
                className="text-green-600 focus:text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Confirm Payment
              </DropdownMenuItem>
            )}

            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Transaction
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Billing History</h2>
        <Button className="bg-violet-600 hover:bg-violet-700">
          <Download className="mr-2 h-4 w-4" /> Download Billing History
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">All Transactions</h3>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          </div>
        ) : (
          <TableModal
            data={tableData}
            columns={columns}
            emptyMessage="No transactions found"
          />
        )}
      </div>
    </div>
  );
};

export default TrackPayment;
