"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useAuthStore, User } from "@/store/authStore";
import { login } from "@/app/api/signup.api";
import { toast } from "sonner";
import { LoginFormData, LoginFormValidation } from "@/types/FirmAuthSchema";
import { FcGoogle } from "react-icons/fc";
import { CustomFormField } from "@/components/shared/CustomFormField";

const UnifiedLoginForm = () => {
  const router = useRouter();
  const loginSucess = useAuthStore((state) => state.loginSuccess);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
      consent: true
    },
    mode: "onChange"
  });

  const { isValid } = form.formState;

  // ✅ Role-based routing function
  const getRedirectPath = (role: string): string => {
    const routes = {
      ADMIN: "/admin/dashboard",
      STAFF: "/admin/dashboard",
      CLIENT: "/client/manage-case",
      "": "/role"
    };
    return routes[role as keyof typeof routes] || "/role";
  };

  // ✅ Role-based welcome message
  const getRoleMessage = (role: string): string => {
    const messages = {
      ADMIN: "Welcome back, Admin!",
      STAFF: "Welcome back, Counsel!",
      CLIENT: "Welcome back!",
      "": "Logging in..."
    };
    return messages[role as keyof typeof messages] || "Logging in...";
  };

  const onSubmit = async (data: LoginFormData) => {
    setAuthLoading(true);
    try {
      const response = await login({
        email: data.email,
        password: data.password
      });

      const userData = response.data.user;
      const token = response.data.token;

      if (!token) {
        throw new Error("No token received");
      }

      // Create User object matching your User interface
      const userObject: User = {
        id: userData.id || userData.userId || "",
        email: userData.email || data.email,
        firmId: userData.firmId,
        role: userData.role || "",
        firstName: userData.firstName,
        lastName: userData.lastName,
        firmName: userData.firmName
      };
      // Store user session
      loginSucess(token, userObject);
      // ✅ Display role-specific success message
      toast.success(getRoleMessage(userObject.role));
      router.push(getRedirectPath(userObject.role));
    } catch (error: any) {
      setAuthLoading(false); // turn of loading
      const errorMessage =
        error.response?.data?.message || "Invalid Credentials";
      toast.error(errorMessage);
    }
  };

  const isFieldValid = (fieldName: keyof LoginFormData): boolean => {
    const fieldValue = form.getValues(fieldName);
    const hasError = !!form.getFieldState(fieldName).error;

    const isValuePresent =
      typeof fieldValue === "string"
        ? fieldValue.trim().length > 0
        : !!fieldValue;

    return isValuePresent && !hasError;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        {/* Google Sign-In Button */}
        <Button
          type="button"
          variant="ghost"
          className="w-full text-base font-semibold mt-8 cursor-pointer hover:bg-gray-200"
          onClick={() => toast.info("Google sign-in coming soon!")}
        >
          <FcGoogle />
          Continue with Google
        </Button>

        {/* OR Divider */}
        <div className="relative flex items-center py-2">
          <div className="grow border-t border-gray-300"></div>
          <span className="shrink mx-4 text-sm text-gray-500 bg-white">Or</span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        {/* Email Field */}
        <CustomFormField
          control={form.control}
          name="email"
          label="Email"
          placeholder="e.g. johndoe@gmail.com"
          type="email"
          isFieldValid={isFieldValid("email")}
        />

        {/* Password Field */}
        <CustomFormField
          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          isFieldValid={isFieldValid("password")}
        />

        {/* Continue Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full mt-6 text-base py-3 h-auto bg-[#e5e7eb] hover:bg-[#d1d5db] text-gray-900 font-medium"
          disabled={!isValid || isAuthLoading}
        >
          {isAuthLoading ? (
            <>
              <Loader2 className="animate-spin" />
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
            By signing in, you agree to the{" "}
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

export default UnifiedLoginForm;
