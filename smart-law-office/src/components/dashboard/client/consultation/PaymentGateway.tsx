"use client";

import { useState } from "react";
import useConsultationStore from "@/store/consultationStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConsultService } from "@/app/api/consultation.api";

const NairaSymbol = ({ className = "" }) => (
  <span className={cn("font-medium text-xl align-top", className)}>₦</span>
);

export function PaymentGateway() {
  const {
    formData,
    isBookingOpen,
    resetBooking,
    setStep,
    addConsultation,
    setLastCreatedConsultCode
  } = useConsultationStore();

  const isPaymentStep =
    isBookingOpen && useConsultationStore.getState().step === "payment";

  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile">("card");
  const [isLoading, setIsLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: ""
  });

  if (!formData || !isPaymentStep) return null;

  const clientEmail = formData.email || "client@example.com";
  const fee = formData.consultationFee || 0;

  const handleSimulatedPay = async () => {
    setIsLoading(true);

    try {
      // 1. Create the consultation and get the consultCode
      const response = await ConsultService.createConsultation(formData);
      const consultCode = response.data.code || response.data; // Adjust based on your API response structure

      console.log("Consultation created with code:", consultCode);

      // 2. Store the consultCode for later use in case assignment
      setLastCreatedConsultCode(consultCode);

      // 3. Add the consultation to the dashboard list
      addConsultation({
        consultationId: consultCode,
        clientName: formData.clientName || "N/A",
        caseType: "General Law",
        status: "Scheduled",
        meetingDate: formData.date
          ? new Date(formData.date).toLocaleDateString()
          : "N/A",
        meetingTime: formData.time || "N/A",
        notesSummary:
          formData.notes?.substring(0, 50) + "..." || "New Consultation"
      });

      // 4. Show success message with consultCode
      toast.success(`Consultation booked! Code: ${consultCode}`);

      // 5. Transition to success screen
      setStep("success");
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isPaymentStep} onOpenChange={resetBooking}>
      <DialogContent className="sm:max-w-[800px] h-[70vh] flex p-0">
        {/* Left Sidebar (Payment Methods) */}
        <div className="w-1/3 bg-white p-8 border-r flex flex-col">
          <h2 className="text-xl font-bold mb-6">PAY WITH</h2>
          <div className="space-y-3">
            <div
              className={cn(
                "cursor-pointer p-2 rounded-lg text-sm font-medium",
                paymentMethod === "mobile"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setPaymentMethod("mobile")}
            >
              Mobile Money
            </div>
            <div
              className={cn(
                "cursor-pointer p-2 rounded-lg text-sm font-medium",
                paymentMethod === "card"
                  ? "text-[#6f42c1] font-bold"
                  : "text-gray-500 hover:text-gray-700"
              )}
              onClick={() => setPaymentMethod("card")}
            >
              Card
            </div>
          </div>
        </div>

        {/* Right Content (Card Details) */}
        <div className="w-2/3 p-8 flex flex-col justify-between">
          <div>
            <div className="text-right mb-8">
              <p className="font-semibold text-gray-800">{clientEmail}</p>
              <p className="text-xl font-bold text-green-600 flex items-center justify-end">
                Pay Naira <NairaSymbol className="text-2xl ml-1" />
                {fee.toLocaleString()}
              </p>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-6 mt-10">
                <h3 className="text-lg font-semibold text-gray-700">
                  Enter your card details to pay
                </h3>

                <Input
                  placeholder="CARD NUMBER: 1234 5678 1234 5678"
                  value={cardDetails.number}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, number: e.target.value })
                  }
                  className="h-12 text-lg"
                  maxLength={19}
                />

                <div className="flex space-x-4">
                  <Input
                    placeholder="CARD EXPIRY: 04/25"
                    value={cardDetails.expiry}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, expiry: e.target.value })
                    }
                    className="flex-1 h-12"
                    maxLength={5}
                  />

                  <Input
                    placeholder="CVV: 000"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvv: e.target.value })
                    }
                    className="flex-1 h-12"
                    type="password"
                    maxLength={4}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <Button
              onClick={handleSimulatedPay}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg h-12"
              disabled={isLoading || paymentMethod !== "card"}
            >
              {isLoading
                ? "Processing..."
                : `Pay Naira ${fee.toLocaleString()}`}
            </Button>

            <p className="text-center text-xs text-gray-500 mt-3">
              An additional e-levy fee of 1% may apply to this payment.{" "}
              <a href="#" className="text-[#6f42c1] underline">
                Learn more
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
