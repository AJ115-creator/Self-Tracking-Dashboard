import { useCallback } from 'react'
import { trackEvent } from '../lib/api'

export function useTracking() {
  const track = useCallback(async (featureName: string) => {
    try {
      await trackEvent(featureName)
    } catch (error) {
      // Silently fail tracking - don't interrupt user experience
      console.error('Failed to track event:', error)
    }
  }, [])

  return { track }
}
