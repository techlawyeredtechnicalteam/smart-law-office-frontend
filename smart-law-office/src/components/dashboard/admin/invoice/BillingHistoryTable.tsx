"use client";

import React, { useState } from "react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { InvoiceDetails } from "@/types/Invoice.schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const groupInvoicesByMonth = (invoices: InvoiceDetails[]) => {
  return invoices.reduce(
    (acc, invoice) => {
      const date = new Date(
        invoice.date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$1/$2/$3")
      );
      const monthKey = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric"
      });
      acc[monthKey] = acc[monthKey] || [];
      acc[monthKey].push(invoice);
      return acc;
    },
    {} as Record<string, InvoiceDetails[]>
  );
};

const HistoryRow = ({
  invoice,
  setActiveInvoice
}: {
  invoice: InvoiceDetails;
  setActiveInvoice: (id: string) => void;
}) => (
  <TableRow>
    <TableCell>{invoice.invoiceId}</TableCell>
    <TableCell>{invoice.service}</TableCell>
    <TableCell>{invoice.clientName}</TableCell>
    <TableCell>{invoice.notes}</TableCell>
    <TableCell>₦{invoice.consultationFee.toLocaleString()}</TableCell>
    <TableCell>
      <Badge
        variant="secondary"
        className={cn(
          invoice.status === "Successful" &&
            "bg-green-100 text-green-700 hover:bg-green-100",
          invoice.status === "Pending" &&
            "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
          invoice.status === "Canceled" &&
            "bg-red-100 text-red-700 hover:bg-red-100"
        )}
      >
        {invoice.status}
      </Badge>
    </TableCell>
    <TableCell>{invoice.date}</TableCell>
    <TableCell className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setActiveInvoice(invoice.invoiceId)}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem>Download</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
);

export function BillingHistoryTable({
  isGroupedView = false
}: {
  isGroupedView?: boolean;
}) {
  const { invoiceHistory, setStep, setActiveInvoiceId } = useInvoiceStore();
  const groupedInvoices = groupInvoicesByMonth(invoiceHistory);

  const handleViewInvoice = (id: string) => {
    setActiveInvoiceId(id);
    setStep("history");
  };

  const renderTable = (invoices: InvoiceDetails[], showHeader: boolean) => (
    <Table>
      {showHeader && (
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Client name</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {invoices.map((invoice, index) => (
          <HistoryRow
            key={index}
            invoice={invoice}
            setActiveInvoice={handleViewInvoice}
          />
        ))}
      </TableBody>
    </Table>
  );

  if (isGroupedView) {
    return (
      <div className="space-y-8">
        {Object.keys(groupedInvoices).map((monthKey) => (
          <div key={monthKey} className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{monthKey}</h2>
              <Button
                variant="outline"
                className="bg-purple-50 text-purple-600 hover:bg-purple-100"
              >
                Download History
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              {renderTable(groupedInvoices[monthKey], true)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {renderTable(invoiceHistory, true)}
    </div>
  );
}
