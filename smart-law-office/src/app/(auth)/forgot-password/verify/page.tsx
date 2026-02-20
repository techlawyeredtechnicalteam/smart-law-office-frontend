"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForgotPasswordStore } from "@/store/forgotPasswordStore";
import { toast } from "sonner";
import {
  sendPasswordResetOtp,
  verifyPasswordResetOtp
} from "@/app/api/forgotpassword.api";
import {
  ForgotOtpFormData,
  ForgotOtpSchema
} from "@/types/ForgotPasswordSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const VerifyOtp = () => {
  const router = useRouter();
  const { email } = useForgotPasswordStore();
  // countdown
  const [countdown, setCountdown] = React.useState(30);
  const [showCode, setShowCode] = React.useState<boolean>(false);
  const countdownRef = React.useRef<number | null>(null);

  const form = useForm<ForgotOtpFormData>({
    resolver: zodResolver(ForgotOtpSchema),
    defaultValues: {
      otp: ""
    }
  });

  React.useEffect(() => {
    if (!email) {
      toast.error("Email not found, Start over.");
      // router.push("/forgot-password");
    }
    startCountdown();

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [email]);

  // start count down
  const startCountdown = (seconds = 30) => {
    setCountdown(seconds);
    countdownRef.current = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (countdown > 0) return; // prevent spam
    try {
      await sendPasswordResetOtp({ email });
      toast.info("OTP resent. Check your email");
      startCountdown(30); //30s
    } catch (err: any) {
      toast.error("failed to resend OTP");
    }
  };

  const onVerify = async (data: ForgotOtpFormData) => {
    // setLoading(true)
    try {
      await verifyPasswordResetOtp({ email, otp: data.otp });
      toast.success("OTP verified!");
      router.push(
        `/forgot-password/reset?email=${encodeURIComponent(email)}&otp=${data.otp}`
      );
    } catch (err: any) {
      toast.error("OTP verification failed");
    }
  };

  return (
    <div className="flex flex-col h-full p-8 lg:p-16 justify-center">
      <div className="max-w-lg mx-auto w-full">
        <h1 className="text-5xl font-bold mb-4">We emailed you a code</h1>
        <p className="text-lg text-gray-700 mb-8">
          A Verification code was sent to <strong>{email}</strong>. Enter the
          code below.
        </p>

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
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>

            {/* OTP resend button */}
            <Button
              variant="ghost"
              type="submit"
              size="lg"
              className="w-full text-base"
              disabled={countdown > 0}
              onClick={handleResend}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyOtp;
