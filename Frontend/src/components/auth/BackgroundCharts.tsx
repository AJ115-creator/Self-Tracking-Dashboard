import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'

const lineChartData = [
    {
        id: 'sessions',
        data: [
            { x: 'Jan', y: 23 },
            { x: 'Feb', y: 45 },
            { x: 'Mar', y: 38 },
            { x: 'Apr', y: 67 },
            { x: 'May', y: 54 },
            { x: 'Jun', y: 89 },
            { x: 'Jul', y: 76 },
        ],
    },
]

const lineChartData2 = [
    {
        id: 'conversions',
        data: [
            { x: 'Mon', y: 12 },
            { x: 'Tue', y: 28 },
            { x: 'Wed', y: 19 },
            { x: 'Thu', y: 45 },
            { x: 'Fri', y: 32 },
            { x: 'Sat', y: 58 },
            { x: 'Sun', y: 41 },
        ],
    },
]

const barChartData = [
    { category: 'Q1', value: 42 },
    { category: 'Q2', value: 67 },
    { category: 'Q3', value: 54 },
    { category: 'Q4', value: 89 },
]

const barChartData2 = [
    { category: 'A', value: 35 },
    { category: 'B', value: 58 },
    { category: 'C', value: 42 },
    { category: 'D', value: 71 },
    { category: 'E', value: 49 },
]

export function BackgroundCharts() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-8 left-8 w-80 h-48 opacity-20 hidden md:block">
                <ResponsiveLine
                    data={lineChartData}
                    margin={{ top: 10, right: 10, bottom: 30, left: 30 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 0, max: 100 }}
                    curve="monotoneX"
                    enableArea={true}
                    areaOpacity={0.3}
                    colors={['#f97316']}
                    enablePoints={false}
                    enableGridX={false}
                    enableGridY={false}
                    axisBottom={null}
                    axisLeft={null}
                    animate={false}
                />
            </div>

            <div className="absolute top-16 right-12 w-64 h-40 opacity-15 hidden lg:block">
                <ResponsiveBar
                    data={barChartData}
                    keys={['value']}
                    indexBy="category"
                    margin={{ top: 10, right: 10, bottom: 30, left: 30 }}
                    padding={0.4}
                    colors={['#f97316']}
                    enableGridY={false}
                    axisBottom={null}
                    axisLeft={null}
                    enableLabel={false}
                    animate={false}
                />
            </div>

            <div className="absolute bottom-20 right-8 w-72 h-44 opacity-20 hidden md:block">
                <ResponsiveLine
                    data={lineChartData2}
                    margin={{ top: 10, right: 10, bottom: 30, left: 30 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 0, max: 70 }}
                    curve="cardinal"
                    enableArea={true}
                    areaOpacity={0.4}
                    colors={['#64748b']}
                    enablePoints={false}
                    enableGridX={false}
                    enableGridY={false}
                    axisBottom={null}
                    axisLeft={null}
                    animate={false}
                />
            </div>

            <div className="absolute bottom-12 left-16 w-60 h-36 opacity-15 hidden lg:block">
                <ResponsiveBar
                    data={barChartData2}
                    keys={['value']}
                    indexBy="category"
                    margin={{ top: 10, right: 10, bottom: 20, left: 20 }}
                    padding={0.3}
                    colors={['#94a3b8']}
                    enableGridY={false}
                    axisBottom={null}
                    axisLeft={null}
                    enableLabel={false}
                    animate={false}
                />
            </div>

            <div className="absolute top-1/3 left-4 w-48 h-32 opacity-10 hidden xl:block">
                <ResponsiveLine
                    data={[{
                        id: 'trend',
                        data: [
                            { x: '1', y: 20 },
                            { x: '2', y: 35 },
                            { x: '3', y: 28 },
                            { x: '4', y: 52 },
                            { x: '5', y: 45 },
                        ],
                    }]}
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 0, max: 60 }}
                    curve="natural"
                    colors={['#fb923c']}
                    enablePoints={false}
                    enableGridX={false}
                    enableGridY={false}
                    axisBottom={null}
                    axisLeft={null}
                    animate={false}
                />
            </div>

            <div className="absolute top-1/2 right-4 w-44 h-28 opacity-10 hidden xl:block">
                <ResponsiveBar
                    data={[
                        { x: '1', y: 45 },
                        { x: '2', y: 62 },
                        { x: '3', y: 38 },
                    ]}
                    keys={['y']}
                    indexBy="x"
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                    padding={0.5}
                    colors={['#475569']}
                    enableGridY={false}
                    axisBottom={null}
                    axisLeft={null}
                    enableLabel={false}
                    animate={false}
                />
            </div>

            <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f97316" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
        </div>
    )
}
