import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    icon?: ReactNode
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    icon?: ReactNode
    children: ReactNode
}

export function InputField({ label, icon, className = '', ...props }: InputFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    className={`
            w-full px-4 py-3 
            ${icon ? 'pl-10' : ''} 
            bg-white/5 border border-white/10 
            rounded-xl text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50
            transition-all duration-200
            ${className}
          `}
                />
            </div>
        </div>
    )
}

export function SelectField({ label, icon, children, className = '', ...props }: SelectFieldProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {icon}
                    </div>
                )}
                <select
                    {...props}
                    className={`
            w-full px-4 py-3 
            ${icon ? 'pl-10' : ''} 
            bg-white/5 border border-white/10 
            rounded-xl text-white
            focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50
            transition-all duration-200
            appearance-none cursor-pointer
            ${className}
          `}
                >
                    {children}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export function SubmitButton({
    children,
    isLoading = false,
    ...props
}: {
    children: ReactNode
    isLoading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={isLoading || props.disabled}
            className={`
        w-full py-3 px-4 
        bg-orange-400 hover:bg-orange-500
        text-slate-900 font-semibold rounded-xl
        shadow-lg shadow-orange-400/25
        focus:outline-none focus:ring-2 focus:ring-orange-400/50
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        flex items-center justify-center gap-2
        ${props.className || ''}
      `}
        >
            {isLoading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </button>
    )
}

export function AuthDivider({ text }: { text: string }) {
    return (
        <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-gray-500">{text}</span>
            </div>
        </div>
    )
}

export function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {message}
        </div>
    )
}
