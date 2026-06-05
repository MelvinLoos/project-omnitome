<script setup lang="ts">
const props = defineProps<{
  adventure: any
  updatingNodeId: string | null
}>()

const emit = defineEmits(['update-node'])

const handleRegenerate = (type: string, id: string) => {
  emit('update-node', { type, id })
}
</script>

<template>
  <div class="adventure-container space-y-16 py-8">
    <!-- Header -->
    <section class="text-center space-y-4">
      <h2 class="text-5xl font-fancy text-ttrpg-crimson">{{ adventure.title }}</h2>
      <p class="text-xl italic max-w-2xl mx-auto opacity-90">{{ adventure.hook }}</p>
    </section>

    <!-- Rooms -->
    <div class="space-y-24">
      <article v-for="(room, index) in adventure.rooms" :key="room.id" class="relative">
        <!-- Room Transition -->
        <div v-if="(index as number) > 0 && room.transition" class="mb-12 flex justify-center">
          <div class="max-w-2xl text-center px-6 py-4 bg-ttrpg-gold/5 border-x border-ttrpg-gold/30 italic text-ttrpg-ink/70 relative">
            <span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-parchment px-2 text-ttrpg-gold text-xs font-bold uppercase tracking-widest leading-none">Transition</span>
            {{ room.transition }}
          </div>
        </div>

        <div class="flex items-center gap-4 mb-6">
          <span class="bg-ttrpg-crimson text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-xl shadow-lg">
            {{ (index as number) + 1 }}
          </span>
          <h3 class="text-3xl font-fancy border-b-2 border-ttrpg-gold flex-grow pb-1">{{ room.name }}</h3>
          <GranularRegenerate 
            :loading="updatingNodeId === room.id" 
            @regenerate="handleRegenerate('room', room.id)" 
          />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-12">
            <ReadAloudBox :text="room.read_aloud" />
            <p class="mt-4 first-letter:text-4xl first-letter:font-fancy first-letter:float-left first-letter:mr-2 leading-relaxed">
              {{ room.description_summary }}
            </p>
          </div>

          <!-- Mechanics Column -->
          <div v-if="room.monster_details?.length || room.loot?.length || room.traps?.length || room.skill_checks?.length || room.suggested_actions?.length || room.npcs?.length" class="lg:col-span-12 space-y-6">
          
          <!-- NPCs Present -->
          <div v-if="room.npcs?.length" class="bg-blue-500/5 p-4 border border-blue-500/20 rounded">
            <h4 class="font-bold text-blue-700 uppercase tracking-wider text-sm mb-2">NPCs Present</h4>
            <div class="flex flex-wrap gap-2">
              <template v-for="npcId in room.npcs" :key="npcId">
                <a 
                  v-if="adventure.npcs.find(n => n.id === npcId)"
                  :href="'#npc-' + npcId" 
                  class="text-sm font-bold text-blue-600 hover:text-blue-800 underline decoration-blue-500/30 transition-colors"
                >
                  {{ adventure.npcs.find(n => n.id === npcId).name }}
                </a>
              </template>
            </div>
          </div>

          <div v-if="room.monster_details?.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatBlock v-for="m in room.monster_details" :key="m.slug" :stats="m.raw_stats" />
          </div>

          <!-- Skill Checks -->
          <div v-if="room.skill_checks?.length" class="bg-ttrpg-crimson/5 p-4 border border-ttrpg-crimson/20 rounded">
            <h4 class="font-bold text-ttrpg-crimson uppercase tracking-wider text-sm mb-2">Skill Checks</h4>
            <ul class="space-y-2">
              <li v-for="check in room.skill_checks" :key="check.skill" class="text-sm">
                <span class="font-bold">{{ check.skill }} DC {{ check.dc }}:</span> {{ check.description }}
              </li>
            </ul>
          </div>

          <!-- Suggested Actions -->
          <div v-if="room.suggested_actions?.length" class="bg-ttrpg-gold/5 p-4 border border-ttrpg-gold/20 rounded">
            <h4 class="font-bold text-ttrpg-ink/80 uppercase tracking-wider text-sm mb-2">Suggested Actions</h4>
            <ul class="list-disc list-inside space-y-1 text-sm italic">
              <li v-for="action in room.suggested_actions" :key="action">{{ action }}</li>
            </ul>
          </div>

          <div v-if="room.loot?.length" class="bg-ttrpg-gold/10 p-4 border border-ttrpg-gold/30 rounded relative group relative">
              <div class="absolute top-2 right-2">
                <GranularRegenerate 
                  :loading="updatingNodeId === 'loot-' + room.id" 
                  @regenerate="handleRegenerate('loot', room.id)" 
                />
              </div>
              <h4 class="font-bold text-ttrpg-ink uppercase tracking-wider text-sm mb-2">Treasure</h4>
              <ul class="list-disc list-inside space-y-1">
                <li v-for="item in room.loot" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- NPCs -->
    <section v-if="adventure.npcs?.length" class="pt-16 border-t-4 border-double border-ttrpg-gold/50">
      <h2 class="text-4xl font-fancy mb-8 text-center">Dramatis Personae</h2>
      <div class="space-y-8">
        <div v-for="npc in adventure.npcs" :key="npc.id" :id="'npc-' + npc.id" class="ttrpg-card bg-parchment-dark relative group scroll-mt-8">
          <div class="absolute top-2 right-2">
            <GranularRegenerate 
              :loading="updatingNodeId === npc.id" 
              @regenerate="handleRegenerate('npc', npc.id)" 
            />
          </div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-2xl font-bold text-ttrpg-crimson">{{ npc.name }}</h3>
              <p class="italic opacity-80">{{ npc.role }}</p>
            </div>
            <span class="text-xs font-bold uppercase tracking-widest px-2 py-1 bg-ttrpg-gold/20 rounded">
              {{ npc.type }}
            </span>
          </div>

          <!-- Basic NPC Layout -->
          <div v-if="npc.type === 'basic'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <p class="text-sm"><span class="font-bold text-ttrpg-crimson uppercase text-xs">Story Tie:</span> {{ npc.story_tie }}</p>
              <p class="text-sm"><span class="font-bold text-ttrpg-crimson uppercase text-xs">Motivation:</span> {{ npc.motivation }}</p>
              <p class="text-sm"><span class="font-bold text-ttrpg-crimson uppercase text-xs">Secret/Quirk:</span> {{ npc.secret_or_quirk || npc.agenda }}</p>
            </div>
          </div>

          <!-- Major NPC Layout -->
          <div v-else class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="bg-ttrpg-gold/10 p-3 rounded border border-ttrpg-gold/20">
                  <p class="text-xs font-bold uppercase text-ttrpg-ink/60 mb-2 border-b border-ttrpg-gold/30">Background (FORD)</p>
                  <ul class="text-sm space-y-1">
                    <li><span class="font-bold">Family:</span> {{ npc.family }}</li>
                    <li><span class="font-bold">Occupation:</span> {{ npc.occupation }}</li>
                    <li><span class="font-bold">Recreation:</span> {{ npc.recreation }}</li>
                    <li><span class="font-bold">Dreams:</span> {{ npc.dreams }}</li>
                  </ul>
                </div>
                <p class="text-sm"><span class="font-bold text-ttrpg-crimson uppercase text-xs block">Story Tie:</span> {{ npc.story_tie }}</p>
                <p class="text-sm"><span class="font-bold text-ttrpg-crimson uppercase text-xs block">Motivation:</span> {{ npc.motivation }}</p>
                <p class="text-sm"><span class="font-bold text-ttrpg-crimson uppercase text-xs block">Physical Presence:</span> {{ npc.physical_presence }}</p>
              </div>
              <div class="space-y-3">
                <p class="text-sm bg-ttrpg-crimson/5 p-2 rounded"><span class="font-bold text-ttrpg-crimson uppercase text-xs block">Unique Look:</span> {{ npc.unique_look }}</p>
                <div class="grid grid-cols-2 gap-2">
                  <div class="p-2 bg-green-500/5 rounded border border-green-500/10">
                    <span class="font-bold text-green-700 uppercase text-[10px] block">Talents</span>
                    <p class="text-xs">{{ npc.talents }}</p>
                  </div>
                  <div class="p-2 bg-red-500/5 rounded border border-red-500/10">
                    <span class="font-bold text-red-700 uppercase text-[10px] block">Flaws</span>
                    <p class="text-xs">{{ npc.flaws }}</p>
                  </div>
                </div>
                <p class="text-sm italic"><span class="font-bold text-ttrpg-crimson uppercase text-[10px] non-italic block">Secret/Quirk:</span> {{ npc.secret_or_quirk }}</p>
              </div>
            </div>
          </div>

          <div v-if="npc.dialogue_samples?.length" class="mt-4 pt-4 border-t border-ttrpg-gold/20 space-y-2">
            <p class="text-[10px] font-bold uppercase tracking-widest text-ttrpg-ink/50">Dialogue Samples</p>
            <blockquote v-for="quote in npc.dialogue_samples" :key="quote" class="text-sm italic border-l-2 border-ttrpg-gold/50 pl-3 py-1">
              "{{ quote }}"
            </blockquote>
          </div>

          <div class="flex flex-wrap gap-2 mt-4 text-[10px]">
            <span v-for="tag in npc.tags" :key="tag" class="bg-ttrpg-gold/10 px-2 py-0.5 rounded text-ttrpg-ink/70 border border-ttrpg-gold/20">
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@media print {
  .adventure-container {
    columns: unset !important;
    display: block !important;
    width: 100% !important;
    padding-top: 0 !important;
  }
  
  section.text-center {
    column-span: all;
    margin-bottom: 2rem;
    break-after: avoid;
  }

  h2.font-fancy {
    font-size: 24pt !important;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: #8c1616 !important; /* Pathfinder-esque crimson */
  }

  article {
    break-before: page;
    page-break-before: always;
    margin-bottom: 2rem;
    display: block;
    position: relative;
  }

  /* Prevent blocks within article from splitting */
  article > div, 
  article section,
  .lg\:col-span-12 > * {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 18pt !important;
    border-bottom: 1px solid #d4af37 !important;
  }

  .grid {
    display: block !important;
  }

  /* Ensure NPCs start on a new page if the list is long */
  section.border-t-4 {
    column-span: all;
    page-break-before: always;
    border-top: 3px double #d4af37 !important;
    padding-top: 2rem;
  }

  .ttrpg-card {
    margin-bottom: 1rem;
    break-inside: avoid;
  }
}
</style>
