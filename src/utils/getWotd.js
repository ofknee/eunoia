// ✧ grabs today’s word + definition from supabase for the wotd page
import supabase from './supabase.js';

const TABLE_NAME = 'words_dictionary';

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default async function getWotd(date = getTodayDateString()) {
  const data = await supabase.fetchSingleByDate(
    TABLE_NAME,
    date,
    'word,definition,date'
  );

  if (!data) {
    return null;
  }

  return {
    word: data.word ?? '',
    definition: data.definition ?? '',
    date: data.date ?? date,
  };
}
