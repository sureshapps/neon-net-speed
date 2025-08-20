import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Wifi, Signal, Timer, Zap } from 'lucide-react';

interface NetworkStatsProps {
  ping: number;
  jitter: number;
  downloadSpeed: number;
  uploadSpeed: number;
}

interface ConnectionInfo {
  ip: string;
  isp: string;
  location: string;
  type: 'WiFi' | 'Mobile' | 'Ethernet' | 'Unknown';
}

export const NetworkStats: React.FC<NetworkStatsProps> = ({ 
  ping, 
  jitter, 
  downloadSpeed, 
  uploadSpeed 
}) => {
  const [info, setInfo] = useState<ConnectionInfo>({
    ip: '—',
    isp: '—',
    location: '—',
    type: 'Unknown'
  });

  // Detect connection type more safely
  const getConnectionType = (): ConnectionInfo["type"] => {
    const nav = navigator as any;
    if (nav?.connection?.effectiveType) {
      // Normalize Chrome's effectiveType (e.g. "4g", "wifi")
      const type = nav.connection.effectiveType.toLowerCase();
      if (type.includes("wifi")) return "WiFi";
      if (type.includes("cell") || type.includes("3g") || type.includes("4g") || type.includes("5g")) return "Mobile";
    }
    if (navigator.userAgent.includes('Mobile')) return "Mobile";
    return "WiFi"; // Fallback assumption
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        setInfo({
          ip: data.ip || '—',
          isp: data.org || data.isp || 'Unknown',
          location: data.city && data.country_name 
            ? `${data.city}, ${data.country_name}` 
            : (data.country_name || '—'),
          type: getConnectionType()
        });
      } catch (err) {
        console.error('Failed to fetch connection info', err);
      }
    };

    fetchInfo();
  }, []);

  const getPingQuality = (ping: number) => {
    if (ping <= 0) return { label: '—', color: 'text-muted-foreground' };
    if (ping < 20) return { label: 'Excellent', color: 'text-neon-green' };
    if (ping < 50) return { label: 'Good', color: 'text-neon-cyan' };
    if (ping < 100) return { label: 'Fair', color: 'text-neon-orange' };
    return { label: 'Poor', color: 'text-neon-pink' };
  };

  const pingQuality = getPingQuality(ping);

  // Compute ratio safely
  const speedRatio = uploadSpeed > 0 ? (downloadSpeed / uploadSpeed).toFixed(1) : "0.0";

  return (
    <div className="space-y-4">
      {/* Network Quality */}
      <Card className="p-4 bg-card/50 border-muted backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-neon-cyan mb-4">Network Quality</h3>
        
        <div className="space-y-4">
          {/* Ping */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Signal className="w-4 h-4 text-neon-purple" />
              <span className="text-sm">Latency</span>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${pingQuality.color}`}>
                {ping > 0 ? `${ping.toFixed(0)} ms` : '—'}
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
                {jitter > 0 ? `${jitter.toFixed(1)} ms` : '—'}
              </div>
              <div className="text-xs text-muted-foreground">
                {jitter > 0 ? (jitter < 5 ? 'Stable' : 'Variable') : '—'}
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
                {speedRatio}:1
              </div>
              <div className="text-xs text-muted-foreground">Down:Up</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Connection Info */}
      <Card className="p-4 bg-card/50 border-muted backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-neon-cyan mb-4">Connection Info</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Server</span>
            <span className="text-sm">{info.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">ISP</span>
            <span className="text-sm">{info.isp}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">IP</span>
            <span className="text-sm">{info.ip}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Type</span>
            <div className="flex items-center space-x-1">
              <Wifi className="w-3 h-3 text-neon-cyan" />
              <span className="text-sm">{info.type}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
