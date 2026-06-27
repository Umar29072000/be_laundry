import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string(),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
  SUPABASE_BUCKET_NAME: z.string().default('laundry-profiles'),
  FRONTEND_URL: z.string().optional(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  EMAIL_FROM: z.string(),
  FONNTE_TOKEN: z.string().optional(),
  WHATSAPP_ENABLED: z.string().optional().default('false').transform((val) => val === 'true'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
