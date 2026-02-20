import { string, z } from "zod";

// Schema for forgot password (email only)
export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
});

// Schema for reset password (email + confirmPassword)
export const ResetPasswordSchema = z
  .object({
    // email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

const ForgotOtpSchema = z.object({
  otp: z
    .string()
    .min(6, { message: "Code must be 6 digits." })
    .max(6, { message: "Code must be 6 digits." })
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;
type ForgotOtpFormData = z.infer<typeof ForgotOtpSchema>;
type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export { ForgotOtpSchema };
export type {
  ForgotPasswordFormData,
  ForgotOtpFormData,
  ResetPasswordFormData
};
