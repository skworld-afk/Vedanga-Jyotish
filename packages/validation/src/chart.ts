import { z } from "zod";

export const CreateChartSchema = z.object({
  name: z.string().min(1, "Name is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  placeName: z.string().min(1, "Place name is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});