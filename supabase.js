const SUPABASE_URL =
'https://ipygvyelqcbmvdxwerkh.supabase.co';

const SUPABASE_KEY =
'sb_publishable_GLcP3MaAejpJx8BGBFkHIQ_SmTre2Tr';

window.sb =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );