export interface DateValueType {
  startDate: string | null
  endDate: string | null
}

interface DateRangePickerProps {
  value: DateValueType
  onChange: (value: DateValueType) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      startDate: e.target.value || null,
    })
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      endDate: e.target.value || null,
    })
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-400 mb-2">
        Date Range
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 min-w-[130px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="date"
            value={value?.startDate || ''}
            onChange={handleStartDateChange}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-sm"
          />
        </div>
        <span className="text-slate-500 shrink-0">to</span>
        <div className="relative flex-1 min-w-[130px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <input
            type="date"
            value={value?.endDate || ''}
            onChange={handleEndDateChange}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-sm"
          />
        </div>
      </div>
    </div>
  )
}
