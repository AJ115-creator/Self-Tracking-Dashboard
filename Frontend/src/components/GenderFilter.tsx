interface GenderFilterProps {
  value: string | null
  onChange: (value: string | null) => void
}

export function GenderFilter({ value, onChange }: GenderFilterProps) {
  return (
    <div>
      <label htmlFor="gender-filter" className="block text-sm font-medium text-slate-400 mb-2">
        Gender
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <select
          id="gender-filter"
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full pl-9 pr-10 py-2.5 bg-slate-700/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-sm cursor-pointer"
        >
          <option value="" className="bg-slate-800">All Genders</option>
          <option value="Male" className="bg-slate-800">Male</option>
          <option value="Female" className="bg-slate-800">Female</option>
          <option value="Other" className="bg-slate-800">Other</option>
        </select>
      </div>
    </div>
  )
}
