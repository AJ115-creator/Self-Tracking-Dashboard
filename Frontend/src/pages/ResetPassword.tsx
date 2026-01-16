import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { api } from '../lib/api'
import {
  AuthLayout,
  AuthCard,
  InputField,
  SubmitButton,
  ErrorMessage,
} from '../components/auth'

export function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    // Supabase sends token in URL hash fragment: #access_token=...&type=recovery
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const token = params.get('access_token')
    const type = params.get('type')

    console.log('Reset password URL hash:', hash)
    console.log('Token:', token, 'Type:', type)

    if (token) {
      // Accept token if type is recovery or if type is missing (some Supabase versions)
      setAccessToken(token)
    } else {
      // Check if there's an error in the URL
      const errorDesc = params.get('error_description')
      if (errorDesc) {
        setError(decodeURIComponent(errorDesc))
      } else if (hash) {
        // Hash exists but no token - might be different format
        setError('Invalid reset link format. Please request a new one.')
      }
      // If no hash at all, show the "Request New Reset Link" button (no error message)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (!accessToken) {
      setError('Invalid reset token. Please request a new reset link.')
      return
    }

    setIsLoading(true)

    try {
      await api.post('/auth/reset-password', {
        access_token: accessToken,
        new_password: password
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard title="Set New Password" subtitle="Enter your new password below">
        {error && <ErrorMessage message={error} />}

        {success ? (
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm text-center">
                Your password has been reset successfully!
              </p>
            </div>
            <Link
              to="/login"
              className="block w-full text-center py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : accessToken ? (
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <InputField
              label="New Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <InputField
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />

            <SubmitButton type="submit" isLoading={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </SubmitButton>
          </form>
        ) : (
          <div className="mt-4 space-y-4">
            <Link
              to="/forgot-password"
              className="block w-full text-center py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              Request New Reset Link
            </Link>
          </div>
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
