import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseMisconfigured = !supabaseUrl || !supabaseAnonKey

export const supabase = supabaseMisconfigured
  ? createClient('https://placeholder.supabase.co', 'placeholder')
  : createClient(supabaseUrl!, supabaseAnonKey!)
