import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface SpeedChartProps {
  data: { timestamp: number; speed: number }[];
  currentTime: number;
}

const SpeedChart = ({ data, currentTime }: SpeedChartProps) => {
  return (
    <div className="w-full h-40 p-4 bg-card rounded-lg border border-border">
      <h3 className="text-sm font-medium text-foreground mb-4">Speed Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="timestamp"
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            tickFormatter={(value) => `${value}s`}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Line
            type="monotone"
            dataKey="speed"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpeedChart;
