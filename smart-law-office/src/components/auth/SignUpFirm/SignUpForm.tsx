"use client";

import { z } from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, SignUpSchema } from "@/types/zodSchemaTypes";
import { CheckCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

type SignUpFormValues = z.infer<typeof SignUpSchema>;

const SignUpForm = () => {
  const router = useRouter();
  const { signup } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    React.useState<boolean>(false);

  // sign up form type for useForm uses the Zod-inferred shape
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firmId: ""
    }
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signup(data.email, data.password);
      router.push("/firm/verify");
    } catch (error) {
      console.error("Sign-up error:", error);
      // Handle error (e.g., show notification)
      alert("Sign-up failed. Please try again.");
    }
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Continue with Google */}
          <Button
            variant="outline"
            size="lg"
            className="w-full text-base font-semibold"
          >
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
                  <Input placeholder="johndoe@gmail.com" {...field} />
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
                      placeholder="e.g. $fuahrakjho.afjrma@-"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
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
                Continuing...
              </>
            ) : (
              "Continue"
            )}
          </Button>

          {/* Terms and Privacy */}
          <div className="flex items-start text-xs pt-2">
            <input
              type="checkbox"
              id="terms"
              defaultChecked
              className="mt-1 mr-2 rounded text-[#7C3AED] focus:ring-[#7C3AED]"
            />
            <label htmlFor="terms" className="text-gray-600">
              By signing up, you agree to the{" "}
              <a
                href="#"
                className="font-semibold text-[#7C3AED] hover:underline"
              >
                Terms of service
              </a>
              , and{" "}
              <a
                href="#"
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
