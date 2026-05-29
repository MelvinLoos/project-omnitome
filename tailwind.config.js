/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        parchment: '#f4eedc',
        'parchment-dark': '#eaddc1',
        ttrpg: {
          gold: '#c5a059',
          crimson: '#8b0000',
          ink: '#2d2d2d'
        }
      },
      fontFamily: {
        serif: ['Inter', 'serif'], // Fallback to Inter, but we want a serif feel as requested
        fancy: ['Georgia', 'serif']
      }
    }
  }
}
