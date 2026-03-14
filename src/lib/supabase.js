import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dzkkothjuqrbcgrnpttp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6a2tvdGhqdXFyYmNncm5wdHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NjQyNzAsImV4cCI6MjA4ODE0MDI3MH0.BkRYwdI4C63Sb4t2BDnOApun8KEkQ3FICDo_-1bFo88'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
