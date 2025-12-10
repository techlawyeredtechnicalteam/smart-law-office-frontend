"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";

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
import { useAuthStore, User } from "@/store/authStore";
import { login } from "@/app/api/signup.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LoginFormData, LoginFormValidation } from "@/lib/FirmAuthSchema";

const LoginForm = () => {
  const router = useRouter();
  const { setUser, user } = useAuthStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  //Login Form validator
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
      consent: false
    },
    mode: "onChange"
  });

  const { isValid, errors } = form.formState;

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await login({
        email: data.email,
        password: data.password
      });

      const userData = response.data.user;
      const token = response.data.token;

      if (!token) {
        throw new Error("No token received from server");
      }

      // Create User object matching your User interface
      const userObject: User = {
        id: userData.id || userData.userId || "",
        email: userData.email || data.email,
        firmId: userData.firmId,
        role: userData.role || "",
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName:
          userData.fullName ||
          `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
          data.email.split("@")[0],
        firmName: userData.firmName
      };

      useAuthStore.getState().loginSuccess(token, userObject);
      // setUser(userData);

      toast.success("Logging In...");
      router.push("/admin/overview");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid Credentials";
      toast.error(errorMessage);
      console.error("Login failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // form valid
  const isFieldValid = (fieldName: keyof LoginFormData) => {
    // Check if the field value is present AND there is no validation error for that specific field
    return form.getValues(fieldName) && !form.getFieldState(fieldName).error;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        {/* Google Sign-In Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-10 text-lg font-semibold mt-8"
        >
          Continue with Google
        </Button>

        {/* OR Divider */}
        <div className="relative flex items-center py-2">
          <div className="grow border-t border-gray-300"></div>
          <span className="shrink mx-4 text-sm text-gray-500 bg-white">Or</span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm">Email</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    placeholder="e.g. johndoe@gmail.com"
                    {...field}
                    // Apply border color based on validation success
                    className={cn(
                      "h-12 border-gray-300 focus-visible:ring-offset-0",
                      {
                        "border-green-500 focus-visible:ring-green-500":
                          isFieldValid("email")
                      }
                    )}
                  />
                </FormControl>
                {/* Green Tick Icon */}
                {isFieldValid("email") && (
                  <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm">Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="e.g. $fuahrakijho.afirma@-"
                    {...field}
                    // Apply border color based on validation success
                    className={cn(
                      "h-12 border-gray-300 focus-visible:ring-offset-0",
                      {
                        "border-green-500 focus-visible:ring-green-500":
                          isFieldValid("password")
                      }
                    )}
                  />
                </FormControl>
                {/* Toggle Password Visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  style={{
                    right: isFieldValid("password") ? "2.5rem" : "0.75rem"
                  }} // Move button if tick is present
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
                {/* Green Tick Icon */}
                {isFieldValid("password") && (
                  <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Continue Button */}
        <Button
          type="submit"
          className="w-full h-12 text-lg font-semibold mt-8"
          disabled={!isValid || isSubmitting}
          style={{
            backgroundColor: "#D9D9D9",
            color: "#6B7280",
            pointerEvents: isValid ? "auto" : "none"
          }}
        >
          {isSubmitting ? "Processing..." : "Continue"}
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
  );
};

export default LoginForm;
