import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { Button } from './ui/button';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  playbackSpeed: number;
  progress: number;
  onProgressChange: (progress: number) => void;
}

const PlaybackControls = ({
  isPlaying,
  onPlayPause,
  onReset,
  onSpeedChange,
  playbackSpeed,
  progress,
  onProgressChange,
}: PlaybackControlsProps) => {
  const speeds = [0.5, 1, 2, 4];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          onClick={onPlayPause}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>

        <Button onClick={onReset} variant="outline" size="lg">
          <RotateCcw className="w-5 h-5" />
        </Button>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <FastForward className="w-4 h-4 text-muted-foreground" />
          {speeds.map((speed) => (
            <Button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              variant={playbackSpeed === speed ? 'default' : 'outline'}
              size="sm"
            >
              {speed}x
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => onProgressChange(Number(e.target.value))}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progress}%, hsl(var(--secondary)) ${progress}%, hsl(var(--secondary)) 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.floor((progress / 100) * 100)}s</span>
          <span>100s</span>
        </div>
      </div>
    </div>
  );
};

export default PlaybackControls;
