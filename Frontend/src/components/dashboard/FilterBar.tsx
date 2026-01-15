import { DateRangePicker, type DateValueType } from '../DateRangePicker'
import { AgeFilter } from '../AgeFilter'
import { GenderFilter } from '../GenderFilter'

interface FilterBarProps {
    dateRange: DateValueType
    onDateRangeChange: (value: DateValueType) => void
    ageGroup: string | null
    onAgeChange: (value: string | null) => void
    gender: string | null
    onGenderChange: (value: string | null) => void
    onRefresh: () => void
    isLoading: boolean
    selectedFeature?: string | null
    onClearFeature?: () => void
}

export function FilterBar({
    dateRange,
    onDateRangeChange,
    ageGroup,
    onAgeChange,
    gender,
    onGenderChange,
    onRefresh,
    isLoading,
    selectedFeature,
    onClearFeature,
}: FilterBarProps) {
    const hasFilters = dateRange.startDate || dateRange.endDate || ageGroup || gender

    const handleClearAll = () => {
        onDateRangeChange({ startDate: null, endDate: null })
        onAgeChange(null)
        onGenderChange(null)
        onClearFeature?.()
    }

    return (
        <div className="bg-slate-800/50 border border-white/5 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="sm:col-span-2 lg:col-span-2">
                        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
                    </div>
                    <AgeFilter value={ageGroup} onChange={onAgeChange} />
                    <GenderFilter value={gender} onChange={onGenderChange} />
                </div>

                <div className="flex items-center gap-2 lg:ml-4">
                    {selectedFeature && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                            <span className="text-sm text-orange-400">
                                Feature: <span className="font-medium">{selectedFeature}</span>
                            </span>
                            <button
                                onClick={onClearFeature}
                                className="text-orange-400 hover:text-orange-300"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {hasFilters && (
                        <button
                            onClick={handleClearAll}
                            className="px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear
                        </button>
                    )}

                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg
                            className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {isLoading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
            </div>
        </div>
    )
}
