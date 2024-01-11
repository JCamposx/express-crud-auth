import { z } from "zod";

export const storeSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  lastname: z.string({
    required_error: "Lastname is required",
  }),
  nationality: z.string({
    required_error: "Nationality is required",
  }),
});

export const updateSchema = z.object({
  name: z.string().optional(),
  lastname: z.string().optional(),
  nationality: z.string().optional(),
});
