import * as z from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }).max(100),
});
