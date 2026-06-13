import { Church, Printer, LogOut, Shield, Eye, ChevronDown } from 'lucide-react'
import type { UserProfile } from '../../types'
import { useState, useRef, useEffect } from 'react'

interface Props {
  profile: UserProfile | null
  onSignOut: () => void
  onPrint: () => void
  saving: boolean
  children: React.ReactNode
}

export function AppShell({ profile, onSignOut, onPrint, saving, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen bg-gray-50 no-print">
      {/* Navbar */}
      <nav className="bg-navy-900 text-white shadow-lg sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-white/15 rounded-lg">
                <Church className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-sm sm:text-base tracking-wide">REHOBOTH</span>
                <span className="hidden sm:inline text-navy-300 text-xs ml-2">Service Planner</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {saving && (
                <span className="text-navy-300 text-xs animate-pulse hidden sm:block">Saving…</span>
              )}

              <button
                onClick={onPrint}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                    {initials}
                  </div>
                  <div className="hidden sm:flex items-center gap-1">
                    <span className="text-sm text-white">{profile?.full_name?.split(' ')[0] ?? 'User'}</span>
                    <ChevronDown className="w-3 h-3 text-navy-300" />
                  </div>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name}</p>
                      <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {profile?.role === 'admin'
                          ? <><Shield className="w-3 h-3 text-navy-900" /><span className="text-xs font-medium text-navy-900">Admin</span></>
                          : <><Eye className="w-3 h-3 text-gray-400" /><span className="text-xs text-gray-500">Volunteer</span></>
                        }
                      </div>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); onSignOut() }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  )
}
