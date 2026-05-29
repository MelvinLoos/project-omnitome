import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const OPEN5E_API_URL = 'https://api.open5e.com/v1/monsters/';

async function ingestOpen5e() {
  console.log('Starting ingestion from Open5e API...');
  let nextUrl = OPEN5E_API_URL;
  let totalIngested = 0;

  try {
    while (nextUrl) {
      console.log(`Fetching: ${nextUrl}`);
      const response = await fetch(nextUrl);
      
      if (!response.ok) {
        throw new Error(`Open5e API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const monsters = data.results;

      if (!monsters || monsters.length === 0) {
        break;
      }

      const mappedMonsters = monsters.map((m) => ({
        slug: m.slug,
        name: m.name,
        cr: m.challenge_rating,
        type: m.type,
        alignment: m.alignment,
        raw_stats: m,
      }));

      const { error } = await supabase
        .from('monsters')
        .upsert(mappedMonsters, { onConflict: 'slug' });

      if (error) {
        console.error('Error upserting monsters to Supabase:', error);
        // Continue to next page even if one page fails, or throw if preferred
      } else {
        totalIngested += mappedMonsters.length;
        console.log(`Successfully upserted ${mappedMonsters.length} monsters (Total: ${totalIngested})`);
      }

      nextUrl = data.next;
    }

    console.log(`Ingestion complete! Total monsters processed: ${totalIngested}`);
  } catch (err) {
    console.error('Ingestion failed:', err);
    process.exit(1);
  }
}

ingestOpen5e();
