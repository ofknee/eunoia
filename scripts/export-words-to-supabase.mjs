#!/usr/bin/env node
// ✧ one-time script to push words.txt into supabase with ids + dates
import fs from 'node:fs';
import path from 'node:path';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const options = {
    file: 'src/words.txt',
    table: process.env.SUPABASE_WORDS_TABLE || 'words',
    column: process.env.SUPABASE_WORDS_COLUMN || 'word',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--file') options.file = argv[i + 1];
    if (arg === '--table') options.table = argv[i + 1];
    if (arg === '--column') options.column = argv[i + 1];
  }

  return options;
}

function formatDateYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function main() {
  loadEnvFile(path.resolve(process.cwd(), '.env.local'));

  const { file, table, column } = parseArgs(process.argv.slice(2));

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL;

  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (preferred), or anon key vars in .env.local.');
    process.exit(1);
  }

  if (!fs.existsSync(file)) {
    console.error(`Words file not found: ${file}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(file, 'utf8');
  const words = [...new Set(raw.split(/\r?\n/).map((w) => w.trim()).filter(Boolean))];

  if (words.length === 0) {
    console.error('No words found to export.');
    process.exit(1);
  }

  const today = new Date();
  const rows = words.map((word, index) => {
    const rowDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + index
    );

    return {
      id: index + 1,
      [column]: word,
      definition: null,
      date: formatDateYYYYMMDD(rowDate),
    };
  });
  const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${table}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Supabase insert failed (${response.status} ${response.statusText}):`);
    console.error(errorText);
    process.exit(1);
  }

  const inserted = await response.json();
  console.log(`Inserted ${inserted.length} rows into ${table}.${column}`);
}

main().catch((err) => {
  console.error('Export script failed:');
  console.error(err);
  process.exit(1);
});
