import { Gauge } from 'lucide-react';

interface SpeedDisplayProps {
  speed: number;
}

const SpeedDisplay = ({ speed }: SpeedDisplayProps) => {
  const getSpeedColor = (speed: number) => {
    if (speed < 30) return 'text-[hsl(var(--speed-low))]';
    if (speed < 60) return 'text-[hsl(var(--speed-medium))]';
    return 'text-[hsl(var(--speed-high))]';
  };

  const getSpeedBg = (speed: number) => {
    if (speed < 30) return 'bg-[hsl(var(--speed-low)/0.1)]';
    if (speed < 60) return 'bg-[hsl(var(--speed-medium)/0.1)]';
    return 'bg-[hsl(var(--speed-high)/0.1)]';
  };

  return (
    <div className={`relative flex items-center gap-4 p-6 rounded-xl ${getSpeedBg(speed)} border border-border backdrop-blur-sm transition-all duration-300`}>
      <div className={`p-3 rounded-full bg-background/50 ${getSpeedColor(speed)}`}>
        <Gauge className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">Current Speed</p>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold ${getSpeedColor(speed)}`}>
            {speed.toFixed(0)}
          </span>
          <span className="text-xl text-muted-foreground">km/h</span>
        </div>
      </div>
    </div>
  );
};

export default SpeedDisplay;
