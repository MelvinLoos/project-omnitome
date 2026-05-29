import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AdventureRenderer from '../components/AdventureRenderer.vue'

describe('AdventureRenderer Print Styles', () => {
  const mockAdventure = {
    title: 'The Lost Crypt',
    hook: 'A mysterious light shines from the hills.',
    rooms: [
      {
        id: '1',
        name: 'Entrance',
        read_aloud: 'You stand before a heavy stone door.',
        description_summary: 'The door is covered in moss.',
        monster_details: [],
        loot: [],
        traps: [],
        skill_checks: [],
        suggested_actions: []
      }
    ],
    npcs: []
  }

  it('renders adventure container', () => {
    const wrapper = mount(AdventureRenderer, {
      props: {
        adventure: mockAdventure,
        updatingNodeId: null
      }
    })
    expect(wrapper.find('.adventure-container').exists()).toBe(true)
  })

  it('has essential print classes or structure', () => {
    const wrapper = mount(AdventureRenderer, {
      props: {
        adventure: mockAdventure,
        updatingNodeId: null
      }
    })
    
    // Check if sections that should span all columns in print are present
    const headerSection = wrapper.find('section.text-center')
    expect(headerSection.exists()).toBe(true)
    
    // Check if rooms are articles (which we styled for print)
    const roomArticle = wrapper.find('article')
    expect(roomArticle.exists()).toBe(true)
  })
})
