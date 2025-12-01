"use client";

import { z } from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, SignUpSchema } from "@/types/SignupSchema";
import { CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SignupPayload } from "@/app/api/signup.api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { sendOtp, signup } from "@/app/api/signup.api";
import { toast } from "sonner";

const SignUpForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);

  // sign up form type for useForm uses the Zod-inferred shape
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firmId: ""
    }
  });

  const onSubmit = React.useCallback(
    async (data: SignUpFormData) => {
      try {
        const payload: SignupPayload = {
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          firmId: data.firmId ?? "",
          firstName: "",
          lastName: "",
          consent: data.consent
        };
        const respond = await signup(payload);
        const User = respond.data?.userId ?? respond.data?.data?.userId;

        if (User) {
          try {
            await sendOtp({ email: User });
            toast.success("Signup successful! OTP sent to your email");
          } catch (sendErr: any) {
            toast.error(
              "Could not send OTP",
              sendErr?.respond?.data?.message ||
                "Try resend on the verify page."
            );
          }
          router.push(`/firm/verify?userId=${encodeURIComponent(User || "")}`);
        } else {
          // fallback: go to verify page
          router.push("/firm/verify");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occured";
        // Error
        if (errorMessage.includes("email already exists")) {
          toast.error("This email is already registered. Please sign in.");
        } else if (errorMessage.includes("invalid firm Id")) {
          toast.error("Invalid Firm ID. Please check and try again");
        } else {
          toast.error(`Signup failed: ${errorMessage}`);
        }
        console.error("Signup error:", error);
      }
    },
    [router]
  );

  // Google Setup
  const handleGoogleSignup = () => {
    toast.info("Google signup coming soon!");
  };

  return (
    <div className="flex flex-col h-full p-8 lg:p-16">
      <h1 className="text-3xl font-semibold mb-2">Welcome to</h1>
      <h2 className="text-3xl font-bold text-[#7C3AED] mb-6">
        Smart Law Office
      </h2>

      {/* Role */}
      <div className="flex items-center text-lg font-medium text-gray-800 mb-6">
        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
        As a Law Firm/Counsel
      </div>

      <Form {...form}>
        {/* handle onsubmit here: onSubmit={form.handleSubmit(onSubmit)} */}
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Continue with Google */}
          <Button
            variant="outline"
            size="lg"
            className="w-full text-base font-semibold"
            onClick={handleGoogleSignup}
          >
            {/* icon here */}
            Continue with Google
          </Button>

          <div className="flex items-center my-4">
            <div className="grow border-t border-gray-300"></div>
            <span className="shrink mx-4 text-gray-500 text-sm">Or</span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="johndoe@gmail.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters containing a letter and a number."
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show Password"
                      }
                    >
                      {showPassword ? (
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

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show Password"
                      }
                    >
                      {showConfirmPassword ? (
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

          {/* Firm ID */}
          <FormField
            control={form.control}
            name="firmId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firm ID</FormLabel>
                <FormControl>
                  <Input id="firmId" placeholder="e.g. 21234342" {...field} />
                </FormControl>
                <p className="text-xs text-gray-500 mt-1">Optional</p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Continue Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full mt-6 text-base"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Continue"
            )}
          </Button>

          {/* Terms and Privacy */}
          <div className="flex items-start text-xs pt-2">
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormControl>
                  <input
                    type="checkbox"
                    id="terms"
                    checked={field.value}
                    onChange={field.onChange}
                    className="mr-2 rounded text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer"
                  />
                </FormControl>
              )}
            />
            <label htmlFor="terms" className="text-gray-600">
              By signing up, you agree to the{" "}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#7C3AED] hover:underline"
              >
                Terms of service
              </a>
              , and{" "}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#7C3AED] hover:underline"
              >
                Privacy policy
              </a>
              .
            </label>
          </div>
        </form>
      </Form>

      <p className="text-sm mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <a href="#" className="font-semibold text-[#7C3AED] hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
};

export default SignUpForm;
