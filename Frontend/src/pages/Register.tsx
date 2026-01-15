import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import {
  AuthLayout,
  AuthCard,
  InputField,
  SelectField,
  SubmitButton,
  ErrorMessage,
} from '../components/auth'

export function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signUp(email, password, username, parseInt(age), gender)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <AuthCard title="Create Account" subtitle="Join our analytics platform today">
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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

          <InputField
            label="Username"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            placeholder="johndoe"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          <InputField
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="••••••••"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Age"
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min={1}
              max={120}
              placeholder="25"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />

            <SelectField
              label="Gender"
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            >
              <option value="" className="bg-slate-800">Select gender</option>
              <option value="Male" className="bg-slate-800">Male</option>
              <option value="Female" className="bg-slate-800">Female</option>
              <option value="Other" className="bg-slate-800">Other</option>
            </SelectField>
          </div>

          <div className="flex items-start gap-2 text-sm pt-2">
            <input
              type="checkbox"
              required
              className="w-4 h-4 mt-0.5 rounded border-white/10 bg-white/5 text-orange-500 focus:ring-orange-500/50"
            />
            <label className="text-gray-400">
              I agree to the{' '}
              <a href="#" className="text-orange-400 hover:text-orange-300">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-orange-400 hover:text-orange-300">
                Privacy Policy
              </a>
            </label>
          </div>

          <SubmitButton type="submit" isLoading={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </SubmitButton>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center mb-1">
              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Analytics</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center mb-1">
              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Real-time</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center mb-1">
              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Secure</span>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
