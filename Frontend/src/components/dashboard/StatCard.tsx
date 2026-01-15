import type { ReactNode } from 'react'

interface StatCardProps {
    title: string
    value: string | number
    icon: ReactNode
    trend?: {
        value: number
        isPositive: boolean
    }
    subtitle?: string
}

export function StatCard({ title, value, icon, trend, subtitle }: StatCardProps) {
    return (
        <div className="bg-slate-800/50 border border-white/5 rounded-xl p-5 hover:bg-slate-800/70 transition-all duration-200 group">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                    <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
                    {subtitle && (
                        <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
                    )}
                </div>
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                    {icon}
                </div>
            </div>
            {trend && (
                <div className="mt-3 flex items-center gap-1">
                    <span
                        className={`text-xs font-medium flex items-center gap-0.5 ${trend.isPositive ? 'text-green-400' : 'text-red-400'
                            }`}
                    >
                        {trend.isPositive ? (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        )}
                        {Math.abs(trend.value)}%
                    </span>
                    <span className="text-slate-500 text-xs">vs last period</span>
                </div>
            )}
        </div>
    )
}
