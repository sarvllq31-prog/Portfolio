// ============================================
// SUPABASE CONFIGURATION
// ============================================

// ⚠️ ضعي مفاتيحك هنا
const SUPABASE_URL = 'https://dzkkothjuqrbcgrnpttp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6a2tvdGhqdXFyYmNncm5wdHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NjQyNzAsImV4cCI6MjA4ODE0MDI3MH0.BkRYwdI4C63Sb4t2BDnOApun8KEkQ3FICDo_-1bFo88';

// Initialize Supabase Client
let supabase;
if (typeof window.supabaseClient === 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabaseClient = supabase;
    console.log('✅ Supabase connected');
} else {
    supabase = window.supabaseClient;
}