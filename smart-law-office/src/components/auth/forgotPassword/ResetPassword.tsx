"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Added useSearchParams
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ResetPasswordFormData,
  ResetPasswordSchema
} from "@/types/ForgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPassword } from "@/app/api/forgotpassword.api";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/shared/CustomFormField";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get email and otp from URL (or your state store)
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email || !otp) {
      toast.error("Session expired. Please start the reset process again.");
      return;
    }

    try {
      const response = await resetPassword({
        email,
        otp,
        password: data.password,
        confirmPassword: data.confirmPassword
      });

      toast.success("Password reset successfully");
      router.push("/login");
    } catch (err: any) {
      console.error("API Error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <CustomFormField
          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter your new password"
          type="password"
        />

        <CustomFormField
          control={form.control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your new password"
          type="password"
        />

        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full text-base bg-violet-600 hover:bg-violet-700"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPassword;
