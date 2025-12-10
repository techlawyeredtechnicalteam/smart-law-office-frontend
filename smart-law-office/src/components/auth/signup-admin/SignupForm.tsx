"use client";

import { email, z } from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, SignUpFormValidation } from "@/lib/FirmAuthSchema";
import { ArrowLeft, CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/shared/ui/form";
import { Input } from "@/components/shared/ui/input";
import { useRouter } from "next/navigation";
// import { completeSignupPayload, signup } from "@/app/api/signup.api";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
// import { SignUpPayload } from "@/store/firmProfileStore";

const SignUpFormAdmin = () => {
  const router = useRouter();
  const { role, setRole, setSignupFormTemp } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);

  // sign up form validator
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpFormValidation),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      consent: true
    }
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setSignupFormTemp({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        fullName: data.fullName,
        address: "N/A",
        consent: data.consent,
        role: "ADMIN" as const
      });
      console.log("=== SETTING TEMP DATA ===", setSignupFormTemp);
      setRole("ADMIN");
      toast.success("Please complete your firm profile to continue");
      router.push("/firm-profile");
    } catch (error: any) {
      console.error("Form error:", error);
    }
  };

  // Google Setup
  const handleGoogleSignup = () => {
    toast.info("Google signup coming soon!");
  };

  return (
    <div className="space-y-4">
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

          {/* firstName */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FullName</FormLabel>
                <FormControl>
                  <Input
                    type="fullName"
                    autoComplete="fullName"
                    placeholder="John Doe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* FirmName */}
          {/* <FormField
            control={form.control}
            name="firmName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firm Name</FormLabel>
                <FormControl>
                  <Input
                    type="firmName"
                    autoComplete="firmName"
                    placeholder="JaneDoe & Co..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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
                Processing...
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
        <a
          href="/login"
          className="font-semibold text-[#7C3AED] hover:underline"
        >
          Sign in
        </a>
      </p>
    </div>
  );
};

export default SignUpFormAdmin;
