import { z } from "zod";

// Flexible password validation that works for both Admin and Staff
const flexiblePasswordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter." });

// Strict password validation for Admin signup only
const strictPasswordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[a-zA-Z]/, { message: "Password must contain a letter." })
  .regex(/[0-9]/, { message: "Password must contain a number." })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: "Password must contain a special character."
  });

const SignUpFormValidation = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: strictPasswordValidation, // Admin signup requires strict password
    confirmPassword: z.string(),
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    firmEmail: z
      .string()
      .email({ message: "Invalid Firm email address." })
      .optional(),
    firmName: z.string().optional(),
    // --- NEW BANK FIELDS ---
    bankName: z.string().optional(),
    bankAccountNumber: z.string().min(10, "Invalid account number").optional(),
    bankAccountName: z.string().optional(),

    consent: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms of service and privacy policy."
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

// ✅ FIXED: Login accepts flexible passwords (for both Admin and Staff)
const LoginFormValidation = z.object({
  email: z.string().email({ message: "Invalid Email address" }),
  password: flexiblePasswordValidation, // Flexible for both Admin and Staff
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms of service and privacy policy."
  })
});

const VerifyFormValidation = z.object({
  otp: z
    .string()
    .min(6, { message: "Code must be 6 digits." })
    .max(6, { message: "Code must be 6 digits." })
});

type SignUpFormData = z.infer<typeof SignUpFormValidation>;
type LoginFormData = z.infer<typeof LoginFormValidation>;
type VerifyFormData = z.infer<typeof VerifyFormValidation>;

export {
  SignUpFormValidation,
  VerifyFormValidation,
  LoginFormValidation,
  strictPasswordValidation,
  flexiblePasswordValidation
};
export type { SignUpFormData, VerifyFormData, LoginFormData };
