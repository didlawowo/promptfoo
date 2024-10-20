import { z } from 'zod';

const EmailSchema = z.string().email();

export const ApiSchemas = {
  Email: {
    Get: {
      Response: z.object({
        email: EmailSchema.nullable(),
      }),
    },
    Update: {
      Request: z.object({
        email: EmailSchema,
      }),
      Response: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
  },
  Redteam: {
    Send: {
      Request: z.object({
        email: EmailSchema,
        config: z.record(z.unknown()),
      }),
      Response: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
    },
  },
};
