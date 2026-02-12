import { useCharacterStore } from '../store/characterStore'
import { useGameStore } from '../store/gameStore'
import { useNavigate } from 'react-router-dom'
import { getTheme } from '../utils/theme'
import { Trash2, AlertOctagon, Save, UserPlus } from 'lucide-react'

export function Settings() {
    const { origin } = useCharacterStore() // Just for theming
    const theme = getTheme(origin)
    const navigate = useNavigate()

    const handleWipeData = () => {
        if (confirm("WARNING: This will wipe ALL character and game data. This cannot be undone. Are you sure?")) {
            localStorage.clear()
            sessionStorage.clear()
            window.location.href = '/' // reloading to root should re-init stores
            window.location.reload()
        }
    }

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} p-4 pb-24`}>
            <div className="max-w-lg mx-auto">
                <h1 className={`text-3xl font-bold mb-8 drop-shadow-md ${theme.accent}`}>SETTINGS</h1>

                <div className={`${theme.card} border ${theme.border} rounded-xl p-6 mb-6`}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-500">
                        <UserPlus /> NEW CHARACTER
                    </h2>
                    <p className="text-sm text-gray-400 mb-6">
                        Start the character creation wizard. This will overwrite your current character.
                    </p>

                    <button
                        onClick={() => navigate('/create')}
                        className="w-full bg-cyan-900/40 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/60 hover:text-cyan-300 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        <UserPlus size={20} />
                        CREATE NEW CHARACTER
                    </button>
                </div>

                <div className={`${theme.card} border ${theme.border} rounded-xl p-6 mb-6`}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-500">
                        <AlertOctagon /> DANGER ZONE
                    </h2>
                    <p className="text-sm text-gray-400 mb-6">
                        Resetting the app will delete your character, inventory, and current game state.
                        Use this if you want to start a completely new campaign.
                    </p>

                    <button
                        onClick={handleWipeData}
                        className="w-full bg-red-900/40 border border-red-500/50 text-red-400 hover:bg-red-900/60 hover:text-red-300 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        <Trash2 size={20} />
                        WIPE DATA & RESET
                    </button>
                </div>

                <div className="text-center text-xs text-gray-600 mt-12 space-y-1">
                    <p>24xx Companion v0.1.0</p>
                    <p>Reforged for the Cube</p>
                    <p className="opacity-70 pt-2">
                        24XX SYSTEM REFERENCE DOCUMENT (SRD) Version 1.41<br />
                        Text CC BY Jason Tocci
                    </p>
                </div>
            </div>
        </div>
    )
}
