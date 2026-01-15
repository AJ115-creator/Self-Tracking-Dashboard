import { ResponsiveLine } from '@nivo/line'

interface DailyCount {
  date: string
  count: number
}

interface LineChartProps {
  data: DailyCount[]
  selectedFeature: string | null
}

export function LineChart({ data, selectedFeature }: LineChartProps) {
  const chartData = [
    {
      id: selectedFeature || 'All Features',
      data: data.map((item) => ({
        x: item.date,
        y: item.count,
      })),
    },
  ]

  const hasData = data.length > 0

  return (
    <div className="h-80">
      {!hasData ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">
              {selectedFeature
                ? `No data for ${selectedFeature}`
                : 'Click a bar to see daily trend'}
            </p>
          </div>
        </div>
      ) : (
        <ResponsiveLine
          data={chartData}
          margin={{ top: 20, right: 30, bottom: 70, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 0,
            max: 'auto',
            stacked: false,
            reverse: false,
          }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: -45,
            legend: '',
            legendOffset: 36,
            legendPosition: 'middle',
            format: (value) => {
              const date = new Date(value)
              return `${date.getDate()}/${date.getMonth() + 1}`
            },
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
            legend: 'Clicks',
            legendOffset: -45,
            legendPosition: 'middle',
          }}
          enableArea={true}
          areaOpacity={0.15}
          pointSize={8}
          pointColor="#0f172a"
          pointBorderWidth={2}
          pointBorderColor="#f97316"
          pointLabelYOffset={-12}
          useMesh={true}
          colors={['#f97316']}
          enableGridX={false}
          enableGridY={true}
          theme={{
            text: {
              fill: '#94a3b8',
              fontSize: 12,
            },
            axis: {
              legend: {
                text: {
                  fill: '#64748b',
                  fontSize: 12,
                },
              },
              ticks: {
                text: {
                  fill: '#94a3b8',
                  fontSize: 11,
                },
              },
            },
            grid: {
              line: {
                stroke: 'rgba(255, 255, 255, 0.05)',
              },
            },
            crosshair: {
              line: {
                stroke: '#f97316',
                strokeWidth: 1,
                strokeOpacity: 0.5,
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
          tooltip={({ point }) => (
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="font-medium">{point.data.xFormatted}</span>
              <span className="text-slate-400">:</span>
              <span>{point.data.yFormatted} clicks</span>
            </div>
          )}
          motionConfig="gentle"
        />
      )}
    </div>
  )
}
