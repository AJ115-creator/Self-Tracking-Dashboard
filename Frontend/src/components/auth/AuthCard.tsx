import type { ReactNode } from 'react'

interface AuthCardProps {
    children: ReactNode
    title: string
    subtitle: string
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
    return (
        <div className="relative z-10 w-full max-w-md mx-4">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 md:p-10">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-white mb-2">
                    {title}
                </h1>
                <p className="text-gray-400 text-center mb-8">{subtitle}</p>

                {children}
            </div>

            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/20 via-transparent to-orange-400/20 rounded-2xl blur-xl -z-10" />
        </div>
    )
}
