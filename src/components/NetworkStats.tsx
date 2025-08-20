import React from 'react';
import { Card } from '@/components/ui/card';
import { Wifi, Signal, Timer, Zap } from 'lucide-react';

interface NetworkStatsProps {
  ping: number;
  jitter: number;
  downloadSpeed: number;
  uploadSpeed: number;
}

export const NetworkStats: React.FC<NetworkStatsProps> = ({ 
  ping, 
  jitter, 
  downloadSpeed, 
  uploadSpeed 
}) => {
  const getPingQuality = (ping: number) => {
    if (ping < 20) return { label: 'Excellent', color: 'text-neon-green' };
    if (ping < 50) return { label: 'Good', color: 'text-neon-cyan' };
    if (ping < 100) return { label: 'Fair', color: 'text-neon-orange' };
    return { label: 'Poor', color: 'text-neon-pink' };
  };

  const pingQuality = getPingQuality(ping);

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card/50 border-muted">
        <h3 className="text-lg font-semibold text-neon-cyan mb-4">Network Quality</h3>
        
        <div className="space-y-4">
          {/* Ping */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Signal className="w-4 h-4 text-neon-purple" />
              <span className="text-sm">Latency</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-neon-purple">
                {ping.toFixed(0)} ms
              </div>
              <div className={`text-xs ${pingQuality.color}`}>
                {pingQuality.label}
              </div>
            </div>
          </div>

          {/* Jitter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4 text-neon-orange" />
              <span className="text-sm">Jitter</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-neon-orange">
                {jitter.toFixed(1)} ms
              </div>
              <div className="text-xs text-muted-foreground">
                {jitter < 5 ? 'Stable' : 'Variable'}
              </div>
            </div>
          </div>

          {/* Speed Ratio */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm">Ratio</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-neon-cyan">
                {uploadSpeed > 0 ? (downloadSpeed / uploadSpeed).toFixed(1) : '0.0'}:1
              </div>
              <div className="text-xs text-muted-foreground">
                Down:Up
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card/50 border-muted">
        <h3 className="text-lg font-semibold text-neon-cyan mb-4">Connection Info</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Server</span>
            <span className="text-sm">San Francisco, CA</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">ISP</span>
            <span className="text-sm">Auto-detected</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">IP</span>
            <span className="text-sm">192.168.1.***</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Type</span>
            <div className="flex items-center space-x-1">
              <Wifi className="w-3 h-3" />
              <span className="text-sm">WiFi</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};