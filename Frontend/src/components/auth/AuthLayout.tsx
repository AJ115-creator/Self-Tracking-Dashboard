import type { ReactNode } from 'react'
import { BackgroundCharts } from './BackgroundCharts'

interface AuthLayoutProps {
    children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
            <BackgroundCharts />
            {children}
        </div>
    )
}
