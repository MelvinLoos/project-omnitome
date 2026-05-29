<script setup lang="ts">
import { computed } from 'vue'
import { parse } from 'marked'

const props = defineProps<{
  text: string
}>()

const renderedHtml = computed(() => {
  return parse(props.text || '', { gfm: true, breaks: true })
})
</script>

<template>
  <div class="read-aloud-box p-6 my-4 bg-ttrpg-ink text-white italic rounded-sm border-l-8 border-ttrpg-gold shadow-md relative group">
    <div class="absolute -top-3 left-4 bg-ttrpg-gold text-ttrpg-ink px-2 py-0.5 text-xs font-bold uppercase tracking-widest rounded-sm">
      Read Aloud
    </div>
    <div class="leading-relaxed prose prose-invert max-w-none" v-html="renderedHtml"></div>
  </div>
</template>

<style scoped>
.read-aloud-box {
  font-family: 'Inter', serif;
}
</style>
