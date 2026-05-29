<script setup lang="ts">
import { reactive, watch, onMounted } from 'vue'

const emit = defineEmits(['update:dials'])

const props = defineProps<{
  disabled?: boolean
}>()

const dials = reactive({
  tone: 'Heroic',
  theme: 'Classic Fantasy',
  length: 3,
  players: 4
})

watch(dials, (newVal) => {
  emit('update:dials', newVal)
}, { deep: true })

onMounted(() => {
  emit('update:dials', dials)
})

const tones = ['Heroic', 'Grimdark', 'Whimsical', 'Horror', 'Mystery']
const themes = ['Classic Fantasy', 'Eldritch', 'Political Intrigue', 'Dungeon Crawl', 'Wilderness Survival']
</script>

<template>
  <div class="ttrpg-card space-y-6">
    <h2 class="text-2xl">Adventure Dials</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" :class="{ 'opacity-50 pointer-events-none': disabled }">
      <div>
        <label class="block text-sm font-bold mb-1">Tone</label>
        <select v-model="dials.tone" class="ttrpg-input" :disabled="disabled">
          <option v-for="t in tones" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-bold mb-1">Theme</label>
        <select v-model="dials.theme" class="ttrpg-input" :disabled="disabled">
          <option v-for="t in themes" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-bold mb-1">Session Length (Hours)</label>
        <input type="number" v-model="dials.length" min="1" max="12" class="ttrpg-input" :disabled="disabled" />
      </div>

      <div>
        <label class="block text-sm font-bold mb-1">Players</label>
        <input type="number" v-model="dials.players" min="1" max="10" class="ttrpg-input" :disabled="disabled" />
      </div>
    </div>
  </div>
</template>
