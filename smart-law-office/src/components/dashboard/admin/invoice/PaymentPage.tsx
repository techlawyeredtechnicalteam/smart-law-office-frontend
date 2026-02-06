"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useInvoiceStore } from "@/store/invoiceStore";
import { cn } from "@/lib/utils";

const paymentSchema = z.object({
  cardNumber: z.string().min(1, { message: "Card number is required." }),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, {
    message: "Invalid MM/YY format."
  }),
  cvv: z.string().length(3, { message: "CVV must be 3 digits." })
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function PaymentPage() {
  const { newInvoiceData, setStep, finalizeInvoice } = useInvoiceStore();
  const invoice = newInvoiceData;

  if (!invoice?.consultationFee || !invoice?.clientName) {
    return (
      <div className="text-center p-10">Invoice data missing for payment.</div>
    );
  }

  const amount = invoice.consultationFee;
  const clientEmail = `${invoice.clientName
    .toLowerCase()
    .replace(/\s/g, "")}@gmail.com`;

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "1234 5678 1234 5678",
      cardExpiry: "04/25",
      cvv: "000"
    }
  });

  const onSubmit = (values: PaymentFormValues) => {
    console.log("Payment initiated:", values);
    setStep("success");
  };

  const PaymentOption = ({
    icon: Icon,
    label,
    isActive
  }: {
    icon: React.ElementType;
    label: string;
    isActive: boolean;
  }) => (
    <div
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors",
        isActive
          ? "text-purple-600 bg-purple-50 font-semibold"
          : "text-gray-600 hover:bg-gray-100"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg border">
      <div className="grid grid-cols-4 gap-8">
        {/* Left Side: Payment Options */}
        <div className="col-span-1 space-y-4 pt-8">
          <PaymentOption
            icon={Smartphone}
            label="Mobile Money"
            isActive={false}
          />
          <PaymentOption icon={CreditCard} label="Card" isActive={true} />
        </div>

        {/* Right Side: Card Form */}
        <div className="col-span-3 border-l pl-8">
          <div className="flex justify-end mb-6">
            <div className="text-right">
              <p className="text-sm font-medium">{clientEmail}</p>
              <p className="text-xl font-bold text-green-600">
                Pay Naira {amount.toLocaleString()}
              </p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 max-w-md mx-auto"
            >
              <h2 className="text-center text-lg font-semibold">
                Enter your card details to pay
              </h2>

              {/* Card Number */}
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CARD NUMBER</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 5678 1234 5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Card Expiry */}
                <FormField
                  control={form.control}
                  name="cardExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CARD EXPIRY</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* CVV */}
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input placeholder="000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white h-12 mt-8"
              >
                Pay Naira {amount.toLocaleString()}
              </Button>

              <p className="text-xs text-center text-gray-500 pt-4">
                An additional e-levy fee of 1% may apply to this payment.{" "}
                <span className="text-blue-600 cursor-pointer">Learn more</span>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
