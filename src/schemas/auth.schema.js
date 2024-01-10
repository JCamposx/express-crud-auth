import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string({
      required_error: "Username is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({
        message: "Invalid email format",
      }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, {
        message: "Password must be at least 6 characters",
      }),
    password_confirmation: z
      .string({
        required_error: "Password confirmation is required",
      })
      .min(6, {
        message: "Password confirmation must be at least 6 characters",
      }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Password confirmation must match the password",
  });

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email format",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});
