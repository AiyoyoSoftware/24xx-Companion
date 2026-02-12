import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, User, BookOpen, Settings, Book } from 'lucide-react'
import { useCharacterStore } from '../store/characterStore'
import { getTheme } from '../utils/theme'

export function Layout() {
    const location = useLocation()
    const origin = useCharacterStore(state => state.origin)
    const theme = getTheme(origin)

    const isActive = (path) => {
        return location.pathname === path ? theme.accent : 'text-gray-400 hover:text-gray-200'
    }

    return (
        <div className={`flex flex-col h-screen ${theme.bg} ${theme.text} ${theme.font} transition-colors duration-500 overflow-hidden`}>
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-20">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className={`fixed bottom-0 left-0 right-0 ${theme.card} border-t ${theme.border} pb-safe transition-colors duration-500`}>
                <div className="flex justify-around items-center h-16">
                    <Link to="/" className={`flex flex-col items-center p-2 ${isActive('/')}`}>
                        <Home size={24} />
                        <span className="text-xs mt-1">Play</span>
                    </Link>
                    <Link to="/character" className={`flex flex-col items-center p-2 ${isActive('/character')}`}>
                        <User size={24} />
                        <span className="text-xs mt-1">Character</span>
                    </Link>
                    <Link to="/journal" className={`flex flex-col items-center p-2 ${isActive('/journal')}`}>
                        <Book size={24} />
                        <span className="text-xs mt-1">Journal</span>
                    </Link>
                    <Link to="/editor" className={`flex flex-col items-center p-2 ${isActive('/editor')}`}>
                        <BookOpen size={24} />
                        <span className="text-xs mt-1">Editor</span>
                    </Link>
                    <Link to="/settings" className={`flex flex-col items-center p-2 ${isActive('/settings')}`}>
                        <Settings size={24} />
                        <span className="text-xs mt-1">Settings</span>
                    </Link>
                </div>
            </nav>
        </div>
    )
}
