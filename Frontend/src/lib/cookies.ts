import Cookies from 'js-cookie'

const COOKIE_OPTIONS = {
  expires: 30, // 30 days
  sameSite: 'lax' as const,
}

export interface FilterState {
  startDate: string | null
  endDate: string | null
  ageGroup: string | null
  gender: string | null
}

const BASE_COOKIE_KEY = 'dashboard_filters'

const getCookieKey = (userId?: string) => {
  return userId ? `${BASE_COOKIE_KEY}_${userId}` : BASE_COOKIE_KEY
}

export const saveFilters = (filters: FilterState, userId?: string) => {
  if (!userId) return
  Cookies.set(getCookieKey(userId), JSON.stringify(filters), COOKIE_OPTIONS)
}

export const loadFilters = (userId?: string): FilterState | null => {
  if (!userId) return null

  const stored = Cookies.get(getCookieKey(userId))
  if (!stored) return null

  try {
    return JSON.parse(stored) as FilterState
  } catch {
    return null
  }
}

export const clearFilters = (userId?: string) => {
  if (userId) {
    Cookies.remove(getCookieKey(userId))
  }
}
