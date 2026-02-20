"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useForgotPasswordStore } from "@/store/forgotPasswordStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ForgotPasswordFormData,
  ForgotPasswordSchema
} from "@/types/ForgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetOtp } from "@/app/api/forgotpassword.api";
import { Loader2, Mail } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { CustomFormField } from "@/components/shared/CustomFormField";

const ForgotPassword = () => {
  const router = useRouter();
  const { setEmail, email } = useForgotPasswordStore();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await sendPasswordResetOtp({
        email: data.email
      });
      response.data;

      setEmail(data.email);
      toast.success("OTP sent to your email");
      router.push("/forgot-password/verify");
    } catch (err: any) {
      console.error("API Error:", err);
      toast.error("Failed to send OTP");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Email */}
        <CustomFormField
          control={form.control}
          name="email"
          label="Email"
          placeholder="e.g. johndoe@gmail.com"
          type="email"
        />

        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full text-base"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPassword;
