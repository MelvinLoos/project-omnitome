<script setup lang="ts">
import { ref, watch } from 'vue'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://127.0.0.1:54321'
const SUPABASE_ANON_KEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' // From status

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const hook = ref('')
const stakes = ref('')
const loading = ref(false)

const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits(['update:hook', 'update:stakes'])

watch(hook, (newVal) => {
  emit('update:hook', newVal)
})
watch(stakes, (newVal) => {
  emit('update:stakes', newVal)
})

async function randomize() {
  loading.value = true
  try {
    const [hookReq, stakesReq] = await Promise.all([
      supabase.from('community_content').select('content').eq('category', 'adventure_hook').gt('upvotes', 10),
      supabase.from('community_content').select('content').eq('category', 'stakes').gt('upvotes', 10)
    ])
    
    if (hookReq.error) throw hookReq.error
    if (stakesReq.error) throw stakesReq.error
    
    if (hookReq.data && hookReq.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * hookReq.data.length)
      hook.value = hookReq.data[randomIndex].content
    }
    
    if (stakesReq.data && stakesReq.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * stakesReq.data.length)
      stakes.value = stakesReq.data[randomIndex].content
    }
  } catch (err) {
    console.error('Failed to fetch hook/stakes:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="ttrpg-card space-y-4">
    <div class="flex justify-between items-center" :class="{ 'opacity-50 pointer-events-none': disabled }">
      <h2 class="text-2xl">Adventure Hook</h2>
      <button 
        @click="randomize" 
        class="ttrpg-button text-sm"
        :disabled="loading || disabled"
      >
        {{ loading ? 'Randomizing...' : 'Randomize' }}
      </button>
    </div>
    
    <textarea 
      v-model="hook" 
      class="ttrpg-input h-32 resize-none" 
      placeholder="Write your core idea or click randomize..."
      :disabled="disabled"
    ></textarea>

    <div class="mt-4" :class="{ 'opacity-50 pointer-events-none': disabled }">
      <h3 class="text-xl font-bold mb-2">Stakes (Ticking Clock)</h3>
      <textarea 
        v-model="stakes" 
        class="ttrpg-input h-20 resize-none" 
        placeholder="What happens if the players do nothing?"
        :disabled="disabled"
      ></textarea>
    </div>
  </div>
</template>
