"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useForgotPasswordStore } from "@/store/forgotPasswordStore";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { toast } from "sonner";
import { sendOtp } from "@/app/api/signup.api";
import {
  ForgotPasswordFormData,
  ForgotPasswordSchema
} from "@/lib/ForgotPasswordSchema";
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
} from "@/components/shared/ui/form";

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
    <div className="max-w-lg mx-auto w-full space-y-8">
      <h1 className="text-3xl font-bold">Forgot Password</h1>
      <p className="text-base text-gray-400">
        Enter your email for the verification process. We'll send a verification
        code to {email || "your email"}
      </p>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
    </div>
  );
};

export default ForgotPassword;
