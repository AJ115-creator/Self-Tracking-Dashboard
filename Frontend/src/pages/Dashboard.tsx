import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTracking } from '../hooks/useTracking'
import { getAnalytics, type AnalyticsParams } from '../lib/api'
import { saveFilters, loadFilters } from '../lib/cookies'
import { type DateValueType } from '../components/DateRangePicker'
import { DashboardHeader, StatCard, ChartCard, FilterBar } from '../components/dashboard'
import { BarChart } from '../components/BarChart'
import { LineChart } from '../components/LineChart'

interface FeatureCount {
  feature_name: string
  count: number
}

interface DailyCount {
  date: string
  count: number
}

export function Dashboard() {
  const { user, signOut } = useAuth()
  const { track } = useTracking()

  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  })
  const [ageGroup, setAgeGroup] = useState<string | null>(null)
  const [gender, setGender] = useState<string | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  const [featureCounts, setFeatureCounts] = useState<FeatureCount[]>([])
  const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const stats = useMemo(() => {
    const totalClicks = featureCounts.reduce((sum, item) => sum + item.count, 0)
    const topFeature = featureCounts.length > 0
      ? featureCounts.reduce((prev, current) =>
        prev.count > current.count ? prev : current
      )
      : null
    const avgDaily = dailyCounts.length > 0
      ? Math.round(dailyCounts.reduce((sum, item) => sum + item.count, 0) / dailyCounts.length)
      : 0
    const featuresCount = featureCounts.length

    return { totalClicks, topFeature, avgDaily, featuresCount }
  }, [featureCounts, dailyCounts])

  useEffect(() => {
    if (!user?.id) return

    const savedFilters = loadFilters(user.id)
    if (savedFilters) {
      setDateRange({
        startDate: savedFilters.startDate,
        endDate: savedFilters.endDate,
      })
      setAgeGroup(savedFilters.ageGroup)
      setGender(savedFilters.gender)
    }
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return

    saveFilters({
      startDate: dateRange?.startDate?.toString() || null,
      endDate: dateRange?.endDate?.toString() || null,
      ageGroup,
      gender,
    }, user.id)
  }, [dateRange, ageGroup, gender, user?.id])

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params: AnalyticsParams = {}

      if (dateRange?.startDate) {
        params.start_date = new Date(dateRange.startDate).toISOString()
      }
      if (dateRange?.endDate) {
        params.end_date = new Date(dateRange.endDate).toISOString()
      }
      if (ageGroup) {
        params.age_group = ageGroup
      }
      if (gender) {
        params.gender = gender
      }
      if (selectedFeature) {
        params.feature_name = selectedFeature
      }

      const response = await getAnalytics(params)
      setFeatureCounts(response.data.feature_counts)
      setDailyCounts(response.data.daily_counts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }, [dateRange, ageGroup, gender, selectedFeature])

  // Only auto-fetch if date range is complete (both set) or empty (both null)
  useEffect(() => {
    const hasStartDate = !!dateRange?.startDate
    const hasEndDate = !!dateRange?.endDate
    const isDateRangeComplete = (hasStartDate && hasEndDate) || (!hasStartDate && !hasEndDate)

    if (isDateRangeComplete) {
      fetchAnalytics()
    }
  }, [fetchAnalytics, dateRange?.startDate, dateRange?.endDate])

  const handleDateRangeChange = (value: DateValueType) => {
    setDateRange(value)
    track('date_picker')
  }

  const handleAgeChange = (value: string | null) => {
    setAgeGroup(value)
    track('filter_age')
  }

  const handleGenderChange = (value: string | null) => {
    setGender(value)
    track('filter_gender')
  }

  const handleBarClick = (featureName: string) => {
    setSelectedFeature(featureName === selectedFeature ? null : featureName)
    track('chart_bar')
  }

  const handleClearFeature = () => {
    setSelectedFeature(null)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardHeader
        title="Analytics Dashboard"
        subtitle="Track user engagement and feature usage"
        userEmail={user?.email}
        onSignOut={handleSignOut}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Clicks"
            value={stats.totalClicks.toLocaleString()}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            }
            subtitle="All tracked interactions"
          />
          <StatCard
            title="Top Feature"
            value={stats.topFeature?.feature_name || '-'}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
            subtitle={stats.topFeature ? `${stats.topFeature.count.toLocaleString()} clicks` : 'No data'}
          />
          <StatCard
            title="Daily Average"
            value={stats.avgDaily.toLocaleString()}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            subtitle="Clicks per day"
          />
          <StatCard
            title="Features Tracked"
            value={stats.featuresCount}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            }
            subtitle="Unique elements"
          />
        </div>

        <div className="mb-6">
          <FilterBar
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            ageGroup={ageGroup}
            onAgeChange={handleAgeChange}
            gender={gender}
            onGenderChange={handleGenderChange}
            onRefresh={fetchAnalytics}
            isLoading={isLoading}
            selectedFeature={selectedFeature}
            onClearFeature={handleClearFeature}
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Feature Clicks"
            subtitle="Click on a bar to filter daily trend"
            isLoading={isLoading}
          >
            <BarChart
              data={featureCounts}
              onBarClick={handleBarClick}
              selectedFeature={selectedFeature}
            />
          </ChartCard>

          <ChartCard
            title="Daily Trend"
            subtitle={selectedFeature ? `Showing data for ${selectedFeature}` : 'All features combined'}
            isLoading={isLoading}
          >
            <LineChart data={dailyCounts} selectedFeature={selectedFeature} />
          </ChartCard>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-600 text-sm">
            Data updates in real-time • Last refreshed just now
          </p>
        </div>
      </main>
    </div>
  )
}
