"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VerifySchema } from "@/types/zodSchemaTypes";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

type VerifyFormData = z.infer<typeof VerifySchema>;

const VerifyFormCode = () => {
  const router = useRouter();
  const { userEmail, verifyCode } = useAuthStore();
  const [showCode, setShowCode] = React.useState<boolean>(false);

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: ""
    }
  });
  const [error, setError] = React.useState<string | null>(null);
  // check if we have user email in store
  if (!userEmail) {
    return (
      <div className="p-16 text-center">
        <p className="text-red-500">
          Error: Missing user email. Please start the sign-up process again.
        </p>
        <Button className="mt-4" onClick={() => router.push("/sign-up")}>
          Go to Sign Up
        </Button>
      </div>
    );
  }

  const onSubmit = React.useCallback(
    async (data: VerifyFormData) => {
      setError(null);
      try {
        await verifyCode(userEmail, data.code);
        router.push("/firm/create-acct");
      } catch (err: any) {
        const errorMessage =
          err.message || "Verification failed. Please try again";
        setError(errorMessage);
      }
    },
    [userEmail]
  );

  return (
    <div className="flex flex-col h-full p-8 lg:p-16 justify-center">
      {/* back to sign-up page */}
      <button
        type="button"
        aria-label="Back to sign-up"
        onClick={() => router.push("/sign-up")}
        className="flex items-center text-sm text-gray-600 hover:text-[#7C3AED] transition-colors absolute top-4 left-4 lg:top-8 lg:left-8"
      >
        <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back
      </button>

      <div className="max-w-lg mx-auto w-full">
        <h1 className="text-5xl font-bold mb-4">We emailed you a code</h1>
        <p className="text-lg text-gray-700 mb-8">
          A Verification code was sent to{" "}
          <span className="font-semibold">{userEmail}</span>. Enter the code
          below.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Verification Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="code"
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
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyFormCode;
