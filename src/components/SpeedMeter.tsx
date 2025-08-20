import React from 'react';
import { Card } from '@/components/ui/card';

interface SpeedMeterProps {
  downloadSpeed: number;
  uploadSpeed: number;
  isRunning: boolean;
  phase: 'idle' | 'ping' | 'download' | 'upload' | 'complete';
}

export const SpeedMeter: React.FC<SpeedMeterProps> = ({ 
  downloadSpeed, 
  uploadSpeed, 
  isRunning, 
  phase 
}) => {
  const maxSpeed = 300;
  const currentSpeed = phase === 'download' ? downloadSpeed : phase === 'upload' ? uploadSpeed : 0;
  const speedPercentage = Math.min((currentSpeed / maxSpeed) * 100, 100);

  return (
    <Card className="neon-border p-8 bg-card/80 backdrop-blur-sm">
      <div className="relative">
        {/* Speedometer Circle */}
        <div className="relative w-80 h-80 mx-auto">
          {/* Background Circle */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="4"
              opacity="0.3"
            />
            
            {/* Speed Arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={
                phase === 'download' ? 'hsl(var(--neon-green))' : 
                phase === 'upload' ? 'hsl(var(--neon-pink))' : 
                'hsl(var(--neon-cyan))'
              }
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${speedPercentage * 2.83} 283`}
              className="transition-all duration-300"
              style={{
                filter: `drop-shadow(0 0 10px ${
                  phase === 'download' ? 'hsl(var(--neon-green))' : 
                  phase === 'upload' ? 'hsl(var(--neon-pink))' : 
                  'hsl(var(--neon-cyan))'
                })`
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center space-y-2">
              <div className={`text-6xl font-bold transition-colors duration-300 ${
                phase === 'download' ? 'text-neon-green' : 
                phase === 'upload' ? 'text-neon-pink' : 
                'text-neon-cyan'
              }`}>
                {currentSpeed.toFixed(1)}
              </div>
              <div className="text-lg text-muted-foreground">Mbps</div>
              {isRunning && (
                <div className={`text-sm uppercase tracking-wider ${
                  phase === 'download' ? 'text-neon-green' : 
                  phase === 'upload' ? 'text-neon-pink' : 
                  'text-neon-cyan'
                }`}>
                  {phase === 'ping' ? 'Testing Latency' :
                   phase === 'download' ? 'Download Test' :
                   phase === 'upload' ? 'Upload Test' : 'Initializing'}
                </div>
              )}
            </div>
          </div>

          {/* Rotating Ring */}
          {isRunning && (
            <div className="absolute inset-2 border-2 border-dashed border-neon-cyan/30 rounded-full animate-spin-slow"></div>
          )}
        </div>

        {/* Speed Scale */}
        <div className="mt-8 flex justify-between text-sm text-muted-foreground">
          <span>0</span>
          <span>75</span>
          <span>150</span>
          <span>225</span>
          <span>300+ Mbps</span>
        </div>

        {/* Current Phase Indicator */}
        <div className="mt-6 flex justify-center space-x-8">
          <div className={`flex items-center space-x-2 transition-colors ${
            phase === 'ping' ? 'text-neon-cyan' : 'text-muted-foreground'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              phase === 'ping' ? 'bg-neon-cyan shadow-neon' : 'bg-muted'
            }`}></div>
            <span className="text-sm">Ping</span>
          </div>
          <div className={`flex items-center space-x-2 transition-colors ${
            phase === 'download' ? 'text-neon-green' : 'text-muted-foreground'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              phase === 'download' ? 'bg-neon-green shadow-neon' : 'bg-muted'
            }`}></div>
            <span className="text-sm">Download</span>
          </div>
          <div className={`flex items-center space-x-2 transition-colors ${
            phase === 'upload' ? 'text-neon-pink' : 'text-muted-foreground'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              phase === 'upload' ? 'bg-neon-pink shadow-neon-pink' : 'bg-muted'
            }`}></div>
            <span className="text-sm">Upload</span>
          </div>
        </div>
      </div>
    </Card>
  );
};