"use client";

import React from "react";
import {
  ResetPasswordFormData,
  ResetPasswordSchema
} from "@/lib/ForgotPasswordSchema";
import { useRouter } from "next/navigation";
import { useForgotPasswordStore } from "@/store/forgotPasswordStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const ResetPassword = () => {
  const router = useRouter();
  const { email } = useForgotPasswordStore();
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  // const onSubmit = async (data: ResetPasswordFormData) => {
  //   try {
  //     // const ResetOtpResponse = await reset
  //   }
  // };

  return (
    <div>
      <div></div>
    </div>
  );
};
export default ResetPassword;
