"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useAuthStore, User } from "@/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VerifyFormValidation } from "@/types/FirmAuthSchema";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { verifyOtp, sendOtp, finalizeSignup } from "@/app/api/signup.api";
import { toast } from "sonner";
import { CustomFormField } from "../shared/CustomFormField";
import { useFirmProfileStore } from "@/store/firmProfileStore";
import { setAuthCookie } from "@/lib/cookies";

type VerifyFormData = z.infer<typeof VerifyFormValidation>;

const VerifyForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const userEmail = params.get("email") || "";
  const userRole = params.get("role") || "";
  const { loginSuccess, isAuthLoading, setAuthLoading } = useAuthStore();

  // Check if email exist
  React.useEffect(() => {
    if (!userEmail) {
      toast.error("Email not found. Please signup again");
      router.push(userRole === "ADMIN" ? "/admin/signup" : "client/signup");
    }
  }, [userEmail, userRole, router]);

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(VerifyFormValidation),
    defaultValues: {
      otp: ""
    }
  });

  const onVerify = async (data: VerifyFormData) => {
    setAuthLoading(true);
    try {
      // verify OTP
      await verifyOtp({ email: userEmail, otp: data.otp });

      // finalize signup
      const response = await finalizeSignup({
        otp: data.otp
      });

      // const userData = response.data?.user || response.data;
      // const token = response.data?.token; // ensure api returns a token
      const { token, user: userData } = response.data;
      const firmData = useFirmProfileStore.getState().formData;

      const completeUser: User = {
        ...userData,
        firmName: firmData.firmName,
        logo: firmData.logoFile
      };

      loginSuccess(token, completeUser);

      useFirmProfileStore.getState().resetProfile();

      toast.success("Account created successfully");
      window.location.href = "/success";

      // if (userData && userData.email) {
      //   const userObject: User = {
      //     id: userData.userId || userData.id || userData.firmId,
      //     email: userData.email,
      //     firstName: userData.firstName,
      //     lastName: userData.lastName,
      //     firmId: userData.firmId,
      //     role: userData.role,
      //     firmName: firmData.firmName || userData.firmName || userData.name,
      //     logo: firmData.logoFile || userData.logo
      //   };

      //   const finalToken = token || "session-active";
      //   setAuthCookie(finalToken, userData.role);

      //   // Commit to store(set user, authenticate and stop loading)
      //   loginSuccess(finalToken, userObject);
      //   useFirmProfileStore.getState().resetProfile();

      //   router.push("/success");
      // } else {
      //   throw new Error(
      //     "Verification succeeded but user data was not returned."
      //   );
      // }
    } catch (err: any) {
      setAuthLoading(false);
      const errorMessage = err.response?.data?.message || "Verification failed";
      toast.error(errorMessage);
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp({ email: userEmail });
      toast.success("OTP resent successfully.");
    } catch (err) {
      toast.error("Failed to resend OTP.");
    }
  };

  return (
    <Form {...form}>
      {/* handle onSubmit onSubmit={form.handleSubmit(onSubmit)}*/}
      <form className="space-y-6" onSubmit={form.handleSubmit(onVerify)}>
        {/* Verification Code */}
        <CustomFormField
          control={form.control}
          name="otp"
          label="Verification Code"
          placeholder="123456"
          // type="number"
        />

        {/* Verify Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full text-base"
          disabled={isAuthLoading}
        >
          {isAuthLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            </>
          ) : (
            "Verify & Create Account"
          )}
        </Button>

        {/* OTP resend button */}
        <Button
          variant="ghost"
          type="button"
          size="lg"
          className="w-full text-base"
          onClick={handleResend}
          disabled={isAuthLoading}
        >
          Resend OTP
        </Button>
      </form>
    </Form>
  );
};

export default VerifyForm;
