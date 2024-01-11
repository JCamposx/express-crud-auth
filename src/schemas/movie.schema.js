import mongoose from "mongoose";
import { z } from "zod";

export const storeSchema = z.object({
  title: z.coerce.string({
    required_error: "Title is required",
  }),
  synopsis: z.coerce.string({
    required_error: "Synopsis is required",
  }),
  release_date: z.coerce.date({
    required_error: "Release date is required",
    invalid_type_error: "Invalid date",
  }),
  rating: z.coerce
    .number({
      required_error: "Rating is required",
      invalid_type_error: "Rating show be a number",
    })
    .min(0, {
      message: "Minimum rating is 0",
    })
    .max(10, {
      message: "Maximum rating is 10",
    }),
  director_id: z.coerce
    .string({
      required_error: "Director ID is required",
    })
    .refine((value) => mongoose.isValidObjectId(value), {
      message: "Invalid director ID",
    }),
});

export const updateSchema = z.object({
  title: z.coerce.string().optional(),
  synopsis: z.coerce.string().optional(),
  release_date: z.coerce
    .date({
      invalid_type_error: "Invalid date",
    })
    .optional(),
  rating: z.coerce
    .number({
      invalid_type_error: "Rating show be a number",
    })
    .min(0, {
      message: "Minimum rating is 0",
    })
    .max(10, {
      message: "Maximum rating is 10",
    })
    .optional(),
  director_id: z.coerce
    .string({
      invalid_type_error: "Invalid director ID",
    })
    .refine((value) => mongoose.isValidObjectId(value), {
      message: "Invalid director ID",
    })
    .optional(),
});
