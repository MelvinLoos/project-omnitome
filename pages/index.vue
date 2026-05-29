<script setup lang="ts">
import { ref, reactive } from 'vue'
import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig()
const supabase = createClient(config.public.supabaseUrl as string, config.public.supabaseAnonKey as string)

const adventure = ref<any>(null)
const generating = ref(false)
const updatingNodeId = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const connectionStatus = ref<'checking' | 'connected' | 'disconnected'>('checking')
const connectionDetails = ref<any>(null)

// Access child states
const dials = reactive({ tone: 'Heroic', theme: 'Classic Fantasy', players: 4, length: 3 })
const hook = ref('')
const stakes = ref('')
const safety = reactive({ lines: [], veils: [] })

async function updateNode({ type, id }: { type: string, id: string }) {
  updatingNodeId.value = id
  errorMessage.value = null
  try {
    const node = (type === 'room' || type === 'loot')
      ? adventure.value.rooms.find((r: any) => r.id === id)
      : adventure.value.npcs.find((n: any) => n.id === id)

    const { data, error } = await supabase.functions.invoke('update-node', {
      body: { 
        type, 
        node, 
        adventureContext: { 
          title: adventure.value.title, 
          theme: dials.theme 
        } 
      }
    })

    if (error) throw error

    // Splice in the new data
    if (type === 'room') {
      const index = adventure.value.rooms.findIndex((r: any) => r.id === id)
      adventure.value.rooms[index] = { ...adventure.value.rooms[index], ...data }
    } else if (type === 'loot') {
      const index = adventure.value.rooms.findIndex((r: any) => r.id === id)
      adventure.value.rooms[index].loot = data.loot || data
    } else {
      const index = adventure.value.npcs.findIndex((n: any) => n.id === id)
      adventure.value.npcs[index] = { ...adventure.value.npcs[index], ...data }
    }
  } catch (err) {
    console.error('Update failed:', err)
    errorMessage.value = 'Failed to update section. Please try again.'
  } finally {
    updatingNodeId.value = null
  }
}

async function generateAdventure() {
  if (!hook.value.trim()) {
    errorMessage.value = 'Please provide an adventure hook first!'
    return
  }

  generating.value = true
  errorMessage.value = null
  adventure.value = null
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-adventure', {
      body: { dials, hook: hook.value, stakes: stakes.value, safety }
    })
    
    if (error) throw error
    adventure.value = data
  } catch (err) {
    console.error('Generation failed:', err)
    errorMessage.value = 'Orchestration failed. Please verify your connection and try again.'
  } finally {
    generating.value = false
  }
}

async function checkConnection() {
  connectionStatus.value = 'checking'
  try {
    const { data, error } = await supabase.functions.invoke('generate-adventure', {
      body: { healthCheck: true }
    })
    if (error) throw error
    connectionDetails.value = data
    connectionStatus.value = data.healthy ? 'connected' : 'disconnected'
  } catch (err) {
    console.error('Connection check failed:', err)
    connectionStatus.value = 'disconnected'
  }
}

import { onMounted } from 'vue'
onMounted(() => {
  checkConnection()
})

function printAdventure() {
  window.print()
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-12 px-4 space-y-8">
    <header class="text-center space-y-2 no-print">
      <h1 class="text-6xl font-fancy text-ttrpg-crimson animate-fade-in">OmniTome</h1>
      <p class="text-xl italic opacity-80 animate-fade-in" style="animation-delay: 0.2s">The Ultimate GM Adventure Orchestrator</p>
    </header>

    <main class="space-y-8">
      <div 
        v-if="connectionStatus === 'disconnected'" 
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      >
        <div class="bg-parchment border-4 border-ttrpg-crimson p-8 max-w-lg w-full rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center space-y-6">
          <div class="text-6xl">⚠️</div>
          <h2 class="text-3xl font-fancy text-ttrpg-crimson">Generation Engine Offline</h2>
          <p class="text-lg opacity-80">
            The magical energies required for adventure generation are currently unreachable. 
            Please check your connection and try again.
          </p>
          <div class="flex flex-col gap-3">
            <button 
              @click="checkConnection" 
              class="ttrpg-button bg-ttrpg-crimson text-white py-4 text-xl hover:bg-red-700 transition-colors"
            >
              Attempt Reconnection
            </button>
            <p class="text-xs opacity-50">Technical Error: Supabase Edge Functions / AI API Timeout</p>
          </div>
        </div>
      </div>

      <div class="no-print space-y-8" :class="{ 'opacity-40 grayscale pointer-events-none': connectionStatus !== 'connected' }">
        <SessionZeroDials 
          :disabled="connectionStatus !== 'connected'"
          @update:dials="(d) => Object.assign(dials, d)" 
        />
        <AdventureHook 
          :disabled="connectionStatus !== 'connected'"
          @update:hook="(h) => hook = h" 
          @update:stakes="(s) => stakes = s" 
        />
        <SafetyTools 
          :disabled="connectionStatus !== 'connected'"
          @update:safety="(s) => { safety.lines = s.lines; safety.veils = s.veils; }" 
        />
      </div>
      
      <div v-if="errorMessage" class="p-4 bg-ttrpg-crimson/10 border-2 border-ttrpg-crimson text-ttrpg-crimson text-center rounded animate-fade-in">
        {{ errorMessage }}
      </div>

      <div class="flex flex-col items-center gap-4 pt-8 no-print">
        <!-- Connection Status Indicator -->
        <div 
          v-if="connectionStatus !== 'connected'"
          class="flex items-center gap-3 px-4 py-2 rounded-full border text-sm transition-all duration-300"
          :class="{
            'bg-yellow-500/10 border-yellow-500/30 text-yellow-600': connectionStatus === 'checking',
            'bg-red-500/10 border-red-500/30 text-red-600': connectionStatus === 'disconnected'
          }"
        >
          <div v-if="connectionStatus === 'checking'" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying connection to generation engine...
          </div>
          <div v-else class="flex items-center gap-3">
            <span class="font-bold">⚠️ Connection Issue:</span>
            <span>Generation services are currently unavailable.</span>
            <button @click="checkConnection" class="underline hover:text-red-700 font-bold ml-2">Retry</button>
          </div>
        </div>

        <div v-else class="flex items-center gap-2 text-green-600 text-sm opacity-80 animate-fade-in">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
          Generation Engine Online
        </div>

        <button 
          @click="generateAdventure"
          class="ttrpg-button text-2xl px-12 py-4 shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:grayscale"
          :disabled="generating || connectionStatus !== 'connected'"
        >
          <span v-if="generating" class="flex items-center gap-2">
            <svg class="animate-spin h-6 w-6" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Orchestrating...
          </span>
          <span v-else>Generate Adventure</span>
        </button>
      </div>

      <div v-if="adventure" class="animate-fade-in print:m-0 print:p-0">
        <div class="no-print-bg print:shadow-none print:border-0 print:bg-transparent print:p-0">
          <AdventureRenderer 
            :adventure="adventure" 
            :updatingNodeId="updatingNodeId"
            @update-node="updateNode" 
          />
          
          <div class="flex justify-center mt-12 no-print border-t border-ttrpg-gold/20 pt-8">
            <button @click="printAdventure" class="ttrpg-button bg-ttrpg-ink hover:bg-black text-white px-8 py-3">
              Print as Booklet (PDF)
            </button>
          </div>
        </div>
      </div>
    </main>

    <footer class="text-center text-sm opacity-60 pt-12 no-print border-t border-ttrpg-gold/20">
      &copy; 2026 OmniTome Adventure Assistant • Built for GMs
    </footer>
  </div>
</template>

<style>
/* Nuxt automatically imports assets/css/main.css if defined in nuxt.config.ts or via modules */
</style>
