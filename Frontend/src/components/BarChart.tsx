import { ResponsiveBar } from '@nivo/bar'

interface FeatureCount {
  feature_name: string
  count: number
}

interface BarChartProps {
  data: FeatureCount[]
  onBarClick: (featureName: string) => void
  selectedFeature: string | null
}

export function BarChart({ data, onBarClick, selectedFeature }: BarChartProps) {
  const chartData = data.map((item) => ({
    feature: item.feature_name,
    count: item.count,
  }))

  return (
    <div className="h-80">
      {chartData.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No data available</p>
          </div>
        </div>
      ) : (
        <ResponsiveBar
          data={chartData}
          keys={['count']}
          indexBy="feature"
          layout="horizontal"
          margin={{ top: 10, right: 30, bottom: 50, left: 120 }}
          padding={0.4}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={(bar) =>
            bar.data.feature === selectedFeature ? '#fb923c' : '#f97316'
          }
          borderRadius={4}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.3]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#ffffff"
          onClick={(bar) => onBarClick(bar.data.feature as string)}
          role="application"
          ariaLabel="Feature clicks bar chart"
          theme={{
            text: {
              fill: '#94a3b8',
              fontSize: 12,
            },
            axis: {
              ticks: {
                text: {
                  fill: '#94a3b8',
                  fontSize: 12,
                },
              },
            },
            grid: {
              line: {
                stroke: 'rgba(255, 255, 255, 0.05)',
              },
            },
            tooltip: {
              container: {
                background: '#1e293b',
                color: '#f1f5f9',
                fontSize: 12,
                borderRadius: 8,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            },
          }}
          tooltip={({ data, value }) => (
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-3 h-3 rounded-sm bg-orange-500" />
              <span className="font-medium">{data.feature}</span>
              <span className="text-slate-400">:</span>
              <span>{value.toLocaleString()} clicks</span>
            </div>
          )}
          motionConfig="gentle"
        />
      )}
    </div>
  )
}
