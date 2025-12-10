"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/shared/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { email, string, z } from "zod";
import { VerifyFormValidation } from "@/lib/FirmAuthSchema";
import { Button } from "@/components/shared/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/shared/ui/form";
import { verifyOtp, sendOtp, finalizeSignup } from "@/app/api/signup.api";
import { toast } from "sonner";
import { useCountdown } from "@/hook/useCountdown";

type VerifyFormData = z.infer<typeof VerifyFormValidation>;

const VerifyForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const userEmail = params.get("email") || "";
  const [showCode, setShowCode] = React.useState<boolean>(false);
  const { setUser, setRole } = useAuthStore();
  // const { countdown, startCountdown, formattedCountdown } = useCountdown(600);

  // Check if email exist
  React.useEffect(() => {
    if (!userEmail) {
      toast.error("Email not found. Please signup again");
      router.push("/signup");
    }
  }, [userEmail, router]);

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(VerifyFormValidation),
    defaultValues: {
      otp: ""
    }
  });

  const onVerify = React.useCallback(
    async (data: VerifyFormData) => {
      if (!userEmail) {
        toast.error("Email not found");
        return;
      }

      try {
        // First verify the OTP
        await verifyOtp({ email: userEmail, otp: data.otp });
        toast.success("OTP verified! Creating account...");

        // Then finalize signup with just OTP
        const response = await finalizeSignup({ otp: data.otp });

        console.log("Finalize signup response:", response);

        // extract user data
        const userData = response.data?.user || response.data;

        if (userData) {
          // update auth store
          setUser({
            id: userData.id,
            email: userData.email,
            fullName:
              userData.fullName || `${userData.firstName} ${userData.lastName}`,
            firstName: userData.firstName,
            lastName: userData.lastName,
            firmId: userData.firmId,
            role: userData.role,
            firmName: userData.firmName
          });
          setRole(userData.role);
          toast.success("Account created successfully! Welcome!");

          //route
          router.push("/success");
        } else {
          toast.error("Failed to create account. Please try again.");
        }
      } catch (err: any) {
        console.error("Verification error:", err);

        // Handle 500 server error specifically
        if (err.response?.status === 500) {
          toast.error(
            "Server error during account creation. The signup-finalize endpoint may not exist. Please check the backend API."
          );
          return;
        }

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "OTP verification failed";
        toast.error(errorMessage);
      }
    },
    [userEmail, router, setUser, setRole]
  );

  const handleResend = async () => {
    if (!userEmail) {
      toast.error("No email found to resend to");
      return;
    }

    try {
      await sendOtp({ email: userEmail });
      toast.success("OTP resent successfully. Check your email!");
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <Form {...form}>
      {/* handle onSubmit onSubmit={form.handleSubmit(onSubmit)}*/}
      <form className="space-y-6" onSubmit={form.handleSubmit(onVerify)}>
        {/* Verification Code */}
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="otp"
                    {...field}
                    type={showCode ? "text" : "password"}
                    placeholder="123456"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                    onClick={() => setShowCode(!showCode)}
                  >
                    {showCode ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Verify Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full text-base"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Verifying & Creating Account...
            </>
          ) : (
            "Verify & Continue"
          )}
        </Button>

        {/* OTP resend button */}
        <Button
          variant="ghost"
          type="button"
          size="lg"
          className="w-full text-base"
          disabled={form.formState.isSubmitting}
          onClick={handleResend}
        >
          Resend OTP
        </Button>
      </form>
    </Form>
  );
};

export default VerifyForm;
