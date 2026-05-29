<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const emit = defineEmits(['update:safety'])

const lines = ref<string[]>([])
const veils = ref<string[]>([])

const newLine = ref('')
const newVeil = ref('')

const props = defineProps<{
  disabled?: boolean
}>()

const presetLines = ['Sexual Assault', 'Harm to Children', 'Real-world Racism', 'Homophobia', 'Spiders/Arachnids']
const presetVeils = ['Romance/Sex', 'Extreme Gore', 'Gruesome Player Death', 'Torture']

function emitUpdate() {
  emit('update:safety', { lines: lines.value, veils: veils.value })
}

watch([lines, veils], () => {
  emitUpdate()
}, { deep: true })

onMounted(() => {
  emitUpdate()
})

function addLine(val?: string | Event) {
  let text = ''
  if (typeof val === 'string') text = val
  else text = newLine.value

  text = text.trim()
  if (text && !lines.value.includes(text)) {
    lines.value.push(text)
  }
  newLine.value = ''
}

function addVeil(val?: string | Event) {
  let text = ''
  if (typeof val === 'string') text = val
  else text = newVeil.value

  text = text.trim()
  if (text && !veils.value.includes(text)) {
    veils.value.push(text)
  }
  newVeil.value = ''
}

function removeLine(index: number) {
  lines.value.splice(index, 1)
}

function removeVeil(index: number) {
  veils.value.splice(index, 1)
}
</script>

<template>
  <div class="ttrpg-card space-y-6">
    <h2 class="text-2xl italic">Safety Tools</h2>
    <p class="text-sm italic opacity-80">Define boundaries to ensure everyone at the table feels safe and comfortable.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8" :class="{ 'opacity-50 pointer-events-none': disabled }">
      <!-- Lines -->
      <div class="space-y-3">
        <h3 class="text-xl border-b border-ttrpg-gold pb-1">Lines (Hard Limits)</h3>
        <p class="text-xs italic">Topics that should NOT appear in the game at all.</p>
        
        <ul class="space-y-1">
          <li v-for="(line, i) in lines" :key="i" class="flex justify-between items-center bg-red-900/10 p-2 rounded border border-red-900/20">
            <span>{{ line }}</span>
            <button @click="removeLine(i)" class="text-ttrpg-crimson hover:text-red-500" :disabled="disabled">×</button>
          </li>
        </ul>

        <div class="flex flex-wrap gap-2 mb-2">
          <button 
            v-for="preset in presetLines" 
            :key="preset" 
            @click="addLine(preset)"
            class="ttrpg-button text-xs py-1 px-2 border-dashed bg-transparent hover:bg-red-900/20 text-red-800"
            :disabled="disabled"
          >
            + {{ preset }}
          </button>
        </div>

        <div class="flex gap-2">
          <input 
            v-model="newLine" 
            @keyup.enter="addLine()"
            class="ttrpg-input text-sm" 
            placeholder="Add a custom line..."
            :disabled="disabled"
          />
          <button @click="addLine()" class="ttrpg-button py-1" :disabled="disabled">+</button>
        </div>
      </div>

      <!-- Veils -->
      <div class="space-y-3">
        <h3 class="text-xl border-b border-ttrpg-gold pb-1">Veils (Soft Limits)</h3>
        <p class="text-xs italic">Topics that may be in the game, but should "fade to black".</p>

        <ul class="space-y-1">
          <li v-for="(veil, i) in veils" :key="i" class="flex justify-between items-center bg-blue-900/10 p-2 rounded border border-blue-900/20">
            <span>{{ veil }}</span>
            <button @click="removeVeil(i)" class="text-ttrpg-crimson hover:text-red-500" :disabled="disabled">×</button>
          </li>
        </ul>

        <div class="flex flex-wrap gap-2 mb-2">
          <button 
            v-for="preset in presetVeils" 
            :key="preset" 
            @click="addVeil(preset)"
            class="ttrpg-button text-xs py-1 px-2 border-dashed bg-transparent hover:bg-blue-900/20 text-blue-800"
            :disabled="disabled"
          >
            + {{ preset }}
          </button>
        </div>

        <div class="flex gap-2">
          <input 
            v-model="newVeil" 
            @keyup.enter="addVeil()"
            class="ttrpg-input text-sm" 
            placeholder="Add a custom veil..."
            :disabled="disabled"
          />
          <button @click="addVeil()" class="ttrpg-button py-1" :disabled="disabled">+</button>
        </div>
      </div>
    </div>
  </div>
</template>
