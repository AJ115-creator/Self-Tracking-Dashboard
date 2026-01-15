import type { ReactNode } from 'react'

interface DashboardHeaderProps {
    title: string
    subtitle?: string
    userEmail?: string
    onSignOut: () => void
    actions?: ReactNode
}

export function DashboardHeader({
    title,
    subtitle,
    userEmail,
    onSignOut,
    actions
}: DashboardHeaderProps) {
    return (
        <header className="bg-slate-800/50 border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 bg-orange-500/10 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-white">{title}</h1>
                            {subtitle && (
                                <p className="text-sm text-slate-400">{subtitle}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {actions}

                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-slate-300">
                                    {userEmail?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>

                            <span className="hidden md:block text-sm text-slate-400 max-w-[150px] truncate">
                                {userEmail}
                            </span>

                            <button
                                onClick={onSignOut}
                                className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                                style={{ color: '#FF6900' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#314158'
                                    e.currentTarget.style.color = '#ffffff'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                    e.currentTarget.style.color = '#FF6900'
                                }}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
