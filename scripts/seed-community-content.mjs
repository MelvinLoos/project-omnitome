import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const sampleHooks = [
  { category: 'adventure_hook', content: 'The local blacksmith found a glowing blue stone in the charcoal pit.', upvotes: 15 },
  { category: 'adventure_hook', content: 'A messenger arrived from the capital, but they were already dead when the horse stopped.', upvotes: 22 },
  { category: 'adventure_hook', content: 'The well in the village square has started whispering names at night.', upvotes: 30 },
  { category: 'adventure_hook', content: 'A traveling circus left behind a cage that "cannot be opened by mortal hands".', upvotes: 12 },
  { category: 'adventure_hook', content: 'The moon turned crimson, and the livestock started walking on two legs.', upvotes: 45 },
];

const sampleStakes = [
  { category: 'stakes', content: 'The village will be overrun by shadow-creatures if the ritual is not stopped.', upvotes: 20 },
  { category: 'stakes', content: 'The ancient pact with the forest spirits will be broken, causing a permanent winter.', upvotes: 18 },
  { category: 'stakes', content: 'A rival adventuring party will claim the artifact and use it to overthrow the kingdom.', upvotes: 25 },
  { category: 'stakes', content: 'The dragon will wake up from its slumber and destroy the nearby trade route.', upvotes: 35 },
  { category: 'stakes', content: 'The secret identity of the local mayor (who is actually a vampire) will be revealed, causing chaos.', upvotes: 14 },
];

async function seed() {
  console.log('Seeding community content...');
  const { error } = await supabase
    .from('community_content')
    .insert([...sampleHooks, ...sampleStakes]);

  if (error) {
    console.error('Error seeding community content:', error);
  } else {
    console.log('Successfully seeded community content!');
  }
}

seed();
