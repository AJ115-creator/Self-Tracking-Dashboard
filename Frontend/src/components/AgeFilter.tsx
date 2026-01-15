interface AgeFilterProps {
  value: string | null
  onChange: (value: string | null) => void
}

export function AgeFilter({ value, onChange }: AgeFilterProps) {
  return (
    <div>
      <label htmlFor="age-filter" className="block text-sm font-medium text-slate-400 mb-2">
        Age Group
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <select
          id="age-filter"
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full pl-9 pr-10 py-2.5 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-sm cursor-pointer"
        >
          <option value="" className="bg-slate-800">All Ages</option>
          <option value="<18" className="bg-slate-800">&lt;18</option>
          <option value="18-40" className="bg-slate-800">18-40</option>
          <option value=">40" className="bg-slate-800">&gt;40</option>
        </select>
      </div>
    </div>
  )
}
