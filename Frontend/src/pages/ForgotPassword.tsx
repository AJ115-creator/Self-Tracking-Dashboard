import { useState } from 'react'
import { Link } from 'react-router'
import { api } from '../lib/api'
import {
  AuthLayout,
  AuthCard,
  InputField,
  SubmitButton,
  ErrorMessage,
} from '../components/auth'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard title="Reset Password" subtitle="Enter your email to receive a reset link">
        {error && <ErrorMessage message={error} />}

        {success ? (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm text-center">
                If an account exists with this email, you'll receive a password reset link shortly.
              </p>
            </div>
            <p className="text-gray-400 text-sm text-center">
              Check your inbox and spam folder.
            </p>
            <Link
              to="/login"
              className="block w-full text-center py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <InputField
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            <SubmitButton type="submit" isLoading={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </SubmitButton>
          </form>
        )}

        <p className="mt-6 text-center text-gray-400 text-sm">
          Remember your password?{' '}
          <Link
            to="/login"
            className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-500 text-center">
            Secure password reset powered by Supabase
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
