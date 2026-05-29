<script setup lang="ts">
const props = defineProps<{
  stats: any
}>()

// Helper to format ability scores
const formatMod = (score: number) => {
  const mod = Math.floor((score - 10) / 2)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

// Helper to format speed
const formatSpeed = (speed: any) => {
  if (!speed) return ''
  if (typeof speed === 'string') return speed
  if (typeof speed === 'object') {
    return Object.entries(speed)
      .map(([type, value]) => {
        const typeStr = type === 'walk' ? '' : `${type} `
        return `${typeStr}${value} ft.`
      })
      .join(', ')
  }
  return speed
}
</script>

<template>
  <div class="stat-block bg-[#fdf1dc] border-t-4 border-b-4 border-[#922610] p-4 text-[#922610] shadow-sm my-4 font-serif break-inside-avoid">
    <h3 class="text-2xl font-bold uppercase m-0 border-b border-[#922610] pb-1">{{ stats.name }}</h3>
    <p class="italic text-sm m-0 py-1">{{ stats.type }} {{ stats.alignment }}</p>
    
    <div class="border-b border-[#922610] my-2"></div>
    
    <div class="space-y-1">
      <p><span class="font-bold">Armor Class</span> {{ stats.armor_class }}</p>
      <p><span class="font-bold">Hit Points</span> {{ stats.hit_points }}</p>
      <p><span class="font-bold">Speed</span> {{ formatSpeed(stats.speed) }}</p>
    </div>

    <div class="border-b border-[#922610] my-2"></div>

    <div class="grid grid-cols-3 md:grid-cols-6 gap-2 text-center py-2">
      <div v-for="attr in ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']" :key="attr" class="flex flex-col">
        <span class="font-bold uppercase text-xs">{{ attr.slice(0, 3) }}</span>
        <span class="text-lg">{{ stats[attr] }} ({{ formatMod(stats[attr]) }})</span>
      </div>
    </div>

    <div class="border-b border-[#922610] my-2"></div>

    <div class="space-y-1 text-sm">
      <p v-if="stats.challenge_rating"><span class="font-bold">Challenge</span> {{ stats.challenge_rating }}</p>
    </div>

    <div v-if="stats.actions" class="mt-4">
      <h4 class="text-xl font-bold italic border-b border-[#922610] mb-2 uppercase">Actions</h4>
      <div v-for="action in stats.actions" :key="action.name" class="mb-2">
        <p class="m-0"><span class="font-bold italic">{{ action.name }}.</span> {{ action.desc }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-block {
  /* Mimic the classic 5e stat block look */
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  position: relative;
}
</style>
