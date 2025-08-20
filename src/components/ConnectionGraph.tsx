import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Download, Upload } from 'lucide-react';

interface ConnectionGraphProps {
  downloadSpeed: number;
  uploadSpeed: number;
  isRunning: boolean;
}

export const ConnectionGraph: React.FC<ConnectionGraphProps> = ({ 
  downloadSpeed, 
  uploadSpeed, 
  isRunning 
}) => {
  const [dataPoints, setDataPoints] = useState<{ download: number; upload: number; time: number }[]>([]);
  const [viewMode, setViewMode] = useState<'both' | 'download' | 'upload'>('both');

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setDataPoints(prev => {
          const newPoint = {
            download: downloadSpeed,
            upload: uploadSpeed,
            time: Date.now()
          };
          
          // Keep only last 50 data points
          const updated = [...prev, newPoint].slice(-50);
          return updated;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isRunning, downloadSpeed, uploadSpeed]);

  const maxSpeed = Math.max(
    ...dataPoints.map(d => Math.max(d.download, d.upload)),
    100
  );

  return (
    <Card className="p-6 bg-card/50 border-muted">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-neon-cyan" />
          <h3 className="text-lg font-semibold text-neon-cyan">Real-time Connection Graph</h3>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'both' ? 'neon' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('both')}
          >
            Both
          </Button>
          <Button
            variant={viewMode === 'download' ? 'neon' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('download')}
            className="text-neon-green hover:text-neon-green"
          >
            <Download className="w-4 h-4 mr-1" />
            Down
          </Button>
          <Button
            variant={viewMode === 'upload' ? 'neon' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('upload')}
            className="text-neon-pink hover:text-neon-pink"
          >
            <Upload className="w-4 h-4 mr-1" />
            Up
          </Button>
        </div>
      </div>

      <div className="relative h-64 bg-background/50 rounded-lg border border-muted p-4">
        {dataPoints.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Start a speed test to see real-time data
          </div>
        ) : (
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={200 - y * 2}
                x2="400"
                y2={200 - y * 2}
                stroke="hsl(var(--muted))"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}

            {/* Download line */}
            {(viewMode === 'both' || viewMode === 'download') && (
              <polyline
                points={dataPoints
                  .map((point, index) => {
                    const x = (index / (dataPoints.length - 1)) * 400;
                    const y = 200 - (point.download / maxSpeed) * 200;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="hsl(var(--neon-green))"
                strokeWidth="2"
                style={{
                  filter: 'drop-shadow(0 0 4px hsl(var(--neon-green)))'
                }}
              />
            )}

            {/* Upload line */}
            {(viewMode === 'both' || viewMode === 'upload') && (
              <polyline
                points={dataPoints
                  .map((point, index) => {
                    const x = (index / (dataPoints.length - 1)) * 400;
                    const y = 200 - (point.upload / maxSpeed) * 200;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="hsl(var(--neon-pink))"
                strokeWidth="2"
                style={{
                  filter: 'drop-shadow(0 0 4px hsl(var(--neon-pink)))'
                }}
              />
            )}
          </svg>
        )}

        {/* Speed scale */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground py-2">
          <span>{maxSpeed.toFixed(0)}</span>
          <span>{(maxSpeed * 0.75).toFixed(0)}</span>
          <span>{(maxSpeed * 0.5).toFixed(0)}</span>
          <span>{(maxSpeed * 0.25).toFixed(0)}</span>
          <span>0 Mbps</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        {(viewMode === 'both' || viewMode === 'download') && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-neon-green shadow-neon"></div>
            <span className="text-sm text-neon-green">Download</span>
          </div>
        )}
        {(viewMode === 'both' || viewMode === 'upload') && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-neon-pink shadow-neon-pink"></div>
            <span className="text-sm text-neon-pink">Upload</span>
          </div>
        )}
      </div>
    </Card>
  );
};
