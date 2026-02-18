// ✧ supabase fetch helper so the app can find words by date
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

function assertSupabaseEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase env vars. In .env.local set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart the Vite dev server.'
    );
  }
}

function getHeaders() {
  return {
    apikey: supabaseAnonKey ?? '',
    Authorization: `Bearer ${supabaseAnonKey ?? ''}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchSingleByDate(table, date, columns = 'word,definition,date') {
  assertSupabaseEnv();

  const baseUrl = (supabaseUrl ?? '').replace(/\/$/, '');
  const query = `select=${encodeURIComponent(columns)}&date=eq.${encodeURIComponent(date)}&limit=1`;
  const url = `${baseUrl}/rest/v1/${table}?${query}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`Supabase request failed (${response.status}): ${responseText}`);
  }

  let rows;
  try {
    rows = JSON.parse(responseText);
  } catch {
    const snippet = responseText.slice(0, 120).replace(/\s+/g, ' ');
    throw new Error(
      `Expected JSON from Supabase but got non-JSON response. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Response starts with: ${snippet}`
    );
  }

  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

const supabase = {
  fetchSingleByDate,
};

export default supabase;
