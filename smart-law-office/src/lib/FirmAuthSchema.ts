import { email, z } from "zod";

const SignUpFormValidation = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[a-zA-Z]/, { message: "Password must contain a letter." })
      .regex(/[0-9]/, { message: "Password must contain a number." }),
    confirmPassword: z.string(),
    fullName: z.string(),
    firmName: z.string().optional(),
    consent: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms of service and privacy policy."
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

const LoginFormValidation = z.object({
  email: z.string().email({ message: "Invalid Email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { message: "Password must contain a letter." })
    .regex(/[0-9]/, { message: "Password must contain a number." }),
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

export { SignUpFormValidation, VerifyFormValidation, LoginFormValidation };
export type { SignUpFormData, VerifyFormData, LoginFormData };
