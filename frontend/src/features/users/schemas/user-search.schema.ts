import { z } from "zod";

export const usersSearchSchema = z.object({
  page: z.number().min(1).optional().default(1),
});