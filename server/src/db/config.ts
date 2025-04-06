import { createClient } from "@supabase/supabase-js";
import dotenv  from "dotenv";

dotenv.config();

const SUPABASE_CLIENT_KEY = process.env.SUPABASE_CLIENT_KEY as string;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY as string;
const SUPABASE_URL = process.env.SUPABASE_URL as string;

export const db = createClient(SUPABASE_URL, SUPABASE_CLIENT_KEY)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

