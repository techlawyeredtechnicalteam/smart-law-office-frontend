"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  subscriptionPaymentSchema,
  SubscriptionPaymentFormValues
} from "@/types/Subscription.schema";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export function SubscriptionPayment() {
  const { setStep, selectedSubscription, billingCycle, setPaymentFormData } =
    useSubscriptionStore();

  const form = useForm<SubscriptionPaymentFormValues>({
    resolver: zodResolver(subscriptionPaymentSchema),
    defaultValues: {
      cardNumber: "5000-9241-2002-9421",
      cardExpiry: "02/30",
      cvv: "000",
      billingAddress: "2 Juris Legal Street",
      country: "Nigeria",
      state: "Lagos",
      city: "Ikeja",
      zipCode: "11111"
    }
  });

  // Calculate total price
  const totalDue = useMemo(() => {
    let multiplier = billingCycle === "Yearly" ? 12 : 1;
    let discountRate = billingCycle === "Yearly" ? 0.2 : 0;
    const subtotal = selectedSubscription.monthlyPrice * multiplier;
    return subtotal - subtotal * discountRate;
  }, [selectedSubscription.monthlyPrice, billingCycle]);

  const onSubmit = (values: SubscriptionPaymentFormValues) => {
    setPaymentFormData(values);
    setStep("summary");
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg">
      <div className="flex items-center space-x-4 pb-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStep("review")}
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Button>
        <h1 className="text-xl font-bold">Enter Your Payment Details</h1>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Side: Payment Form */}
        <div className="col-span-2">
          <h2 className="text-lg font-bold mb-4">Payment Details</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Card Number */}
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g. 5000-9241-2002-9421"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <FormField
                  control={form.control}
                  name="cardExpiry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. 02/30" {...field} />
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
                        <Input placeholder="E.g. 000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Billing Address */}
              <FormField
                control={form.control}
                name="billingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g. 2 Juris Legal Street"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country (Using Select) */}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="E.g. Nigeria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Nigeria">Nigeria</SelectItem>
                        {/* Add other countries here */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State / City / Zip Code */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. Lagos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. Ikeja" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip code</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. 11111" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("review")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Continue to Summary
                </Button>
              </div> */}
            </form>
          </Form>
        </div>

        {/* Right Side: Plan Details Summary */}
        <div className="col-span-1 p-6 bg-purple-50 border border-purple-200 rounded-lg space-y-4 h-fit">
          <div className="flex justify-end mb-4">
            <div className="p-1 rounded-full bg-purple-100 flex space-x-1">
              <Button
                variant="ghost"
                className="rounded-full bg-white shadow-sm text-purple-600 font-semibold h-9 px-4"
              >
                Monthly
              </Button>
              <Button
                variant="ghost"
                className="rounded-full text-gray-600 font-semibold h-9 px-4"
              >
                Yearly
              </Button>
            </div>
          </div>

          <h2 className="text-xl font-bold">{selectedSubscription.name}</h2>
          <p className="mt-1 text-sm text-gray-500">Billed monthly</p>
          <p className="text-3xl font-extrabold text-gray-900">
            ₦{selectedSubscription.monthlyPrice.toLocaleString()}{" "}
            <span className="text-base font-medium text-gray-500">/seat</span>
          </p>

          <ul className="mt-4 space-y-3 text-sm text-gray-700">
            {selectedSubscription.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-purple-600 mr-2 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          {/* The action buttons are moved to the form footer, but the visual might imply a redundant upgrade/cancel here */}
          <div className="pt-4 space-y-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Upgrade
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep("review")}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
