import type { ReactNode } from 'react'

interface ChartCardProps {
    title: string
    children: ReactNode
    subtitle?: string
    action?: ReactNode
    isLoading?: boolean
}

export function ChartCard({ title, children, subtitle, action, isLoading }: ChartCardProps) {
    return (
        <div className="bg-slate-800/50 border border-white/5 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-white font-semibold">{title}</h3>
                    {subtitle && (
                        <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>
                    )}
                </div>
                {action && <div>{action}</div>}
            </div>

            <div className="p-5">
                {isLoading ? (
                    <div className="h-80 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                            <p className="text-slate-500 text-sm">Loading data...</p>
                        </div>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    )
}

export function ChartCardSkeleton() {
    return (
        <div className="bg-slate-800/50 border border-white/5 rounded-xl overflow-hidden animate-pulse">
            <div className="px-5 py-4 border-b border-white/5">
                <div className="h-5 w-32 bg-slate-700 rounded" />
            </div>
            <div className="p-5">
                <div className="h-80 bg-slate-700/50 rounded-lg" />
            </div>
        </div>
    )
}
