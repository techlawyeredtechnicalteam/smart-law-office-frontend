"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, SignUpFormValidation } from "@/types/FirmAuthSchema";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { CustomFormField } from "@/components/shared/CustomFormField";
import { FcGoogle } from "react-icons/fc";

const SignUpFormAdmin = () => {
  const router = useRouter();
  const setSignupFormTemp = useAuthStore((state) => state.setSignupFormTemp);

  // sign up form validator
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpFormValidation),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      consent: true
    }
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // 1. Store data in Zustand (Persisted In Local Storage)
      setSignupFormTemp({
        ...data,
        address: "N/A",
        role: "ADMIN" as const
      });

      // Move to the next step
      toast.success("Personal details saved. Let's set up your firm!");
      router.push("/firm-profile");
    } catch (error: any) {
      console.error("Form error:", error);
    }
  };

  return (
    <>
      <Form {...form}>
        {/* handle onsubmit here: onSubmit={form.handleSubmit(onSubmit)} */}
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Continue with Google */}
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-base font-semibold hover:bg-gray-200 cursor-pointer"
            onClick={() => toast.info("Google signup coming soon!")}
          >
            <FcGoogle />
            Continue with Google
          </Button>

          <div className="flex items-center my-4">
            <div className="grow border-t border-gray-300"></div>
            <span className="shrink mx-4 text-gray-500 text-sm font-light">
              Or
            </span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomFormField
              control={form.control}
              name="firstName"
              label="First Name"
              placeholder="e.g. Christine"
              type="text"
              autoComplete="given-name"
            />

            <CustomFormField
              control={form.control}
              name="lastName"
              label="Last Name"
              placeholder="e.g. Adeola"
              type="text"
              autoComplete="family-name"
            />
          </div>
          {/* Email Field */}
          <CustomFormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            type="email"
            autoComplete="email"
          />

          {/* Password Field */}
          <CustomFormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="e.g. $fuahrakjho.afjma#-"
            type="password"
          />

          {/* Confirm Password Field */}
          <CustomFormField
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Re-enter your password"
            type="password"
          />

          {/* Continue Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full mt-6 text-base bg-gray-200 text-gray-600 hover:bg-gray-300"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Continue to Firm Profile"
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

      <p className="text-sm mt-6 text-gray-600">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-[#7C3AED] hover:underline"
        >
          Sign in
        </a>
      </p>
    </>
  );
};

export default SignUpFormAdmin;
