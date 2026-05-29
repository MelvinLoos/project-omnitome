<script setup lang="ts">
defineProps<{
  loading?: boolean
}>()

defineEmits(['regenerate'])
</script>

<template>
  <button 
    @click.stop="$emit('regenerate')"
    class="p-2 rounded-full hover:bg-ttrpg-gold/20 transition-colors no-print group"
    :class="{ 'animate-spin': loading }"
    :disabled="loading"
    title="Regenerate this section"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-ttrpg-ink/40 group-hover:text-ttrpg-crimson transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  </button>
</template>
