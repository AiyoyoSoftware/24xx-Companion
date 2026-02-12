export const THEMES = {
    Human: {
        bg: 'bg-gray-950',
        text: 'text-gray-100',
        accent: 'text-cyan-400',
        border: 'border-gray-800',
        card: 'bg-gray-900',
        button: 'bg-cyan-600 hover:bg-cyan-500 text-white',
        font: 'font-sans',
        glow: 'shadow-cyan-500/20',
    },
    Android: {
        bg: 'bg-black',
        text: 'text-green-500',
        accent: 'text-green-400',
        border: 'border-green-900',
        card: 'bg-gray-950 border-green-800',
        button: 'bg-green-700 hover:bg-green-600 text-black font-bold',
        font: 'font-mono tracking-wide',
        glow: 'shadow-green-500/20',
    },
    Alien: {
        bg: 'bg-[#1a0526]', // Dark purple/black
        text: 'text-fuchsia-100',
        accent: 'text-fuchsia-400',
        border: 'border-fuchsia-900',
        card: 'bg-fuchsia-950/30 border-fuchsia-800 rounded-3xl', // Organic feel
        button: 'bg-fuchsia-700 hover:bg-fuchsia-600 text-white rounded-xl',
        font: 'font-serif', // Using serif to look a bit "ancient" or different, or we could import a custom font
        glow: 'shadow-fuchsia-500/20',
    }
}

export const getTheme = (origin) => {
    return THEMES[origin] || THEMES.Human
}
