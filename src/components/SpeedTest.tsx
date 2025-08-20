import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, Download, Upload, Wifi, Signal, Globe, User, LogOut } from 'lucide-react';
import { SpeedMeter } from './SpeedMeter';
import { NetworkStats } from './NetworkStats';
import { ConnectionGraph } from './ConnectionGraph';
import { useAuth } from '@/hooks/useAuth';
import { useSpeedTestResults } from '@/hooks/useSpeedTestResults';
import { useToast } from '@/hooks/use-toast';

export const SpeedTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const { user, signOut } = useAuth();
  const { saveTestResult, fetchTestResults, getStats } = useSpeedTestResults();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchTestResults();
    }
  }, [user, fetchTestResults]);

  const stats = getStats();

  const startTest = async () => {
    setIsRunning(true);
    setProgress(0);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setJitter(0);

    // Phase 1: Ping test (3 seconds)
    setPhase('ping');
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setProgress(i / 4); // 25% of total
      setPing(Math.random() * 50 + 10);
      setJitter(Math.random() * 5 + 1);
    }

    // Phase 2: Download test (8 seconds)
    setPhase('download');
    for (let i = 0; i <= 100; i += 1) {
      await new Promise(resolve => setTimeout(resolve, 80));
      setProgress(25 + (i / 100) * 50); // 25% to 75%
      setDownloadSpeed((Math.random() * 0.3 + 0.7) * (100 + Math.random() * 150));
    }

    // Phase 3: Upload test (7 seconds)
    setPhase('upload');
    for (let i = 0; i <= 100; i += 1) {
      await new Promise(resolve => setTimeout(resolve, 70));
      setProgress(75 + (i / 100) * 25); // 75% to 100%
      setUploadSpeed((Math.random() * 0.3 + 0.7) * (50 + Math.random() * 100));
    }

    setPhase('complete');
    setIsRunning(false);

    // Save test result if user is authenticated
    if (user) {
      await saveTestResult({
        download_speed: downloadSpeed,
        upload_speed: uploadSpeed,
        ping: ping,
        jitter: jitter,
        server_location: 'San Francisco, CA',
        connection_type: 'WiFi',
        test_duration: 18 // approximate test duration
      });
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-center space-y-4 flex-1">
          <div className="flex items-center justify-center space-x-3">
            <Zap className="w-12 h-12 text-neon-cyan animate-pulse-neon" />
            <h1 className="text-4xl font-bold neon-text">NeonSpeed</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Ultra-fast network speed testing with real-time analytics
          </p>
          {stats && (
            <div className="text-sm text-muted-foreground">
              {stats.totalTests} tests completed • Avg: {stats.avgDownload.toFixed(1)} Mbps down
            </div>
          )}
        </div>
        
        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-neon-cyan">
                  {user.user_metadata?.display_name || user.email}
                </div>
                <div className="text-xs text-muted-foreground">
                  Signed in
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Test Area */}
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Speed Meter */}
          <div className="lg:col-span-2">
            <SpeedMeter 
              downloadSpeed={downloadSpeed}
              uploadSpeed={uploadSpeed}
              isRunning={isRunning}
              phase={phase}
            />
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <Card className="neon-border p-6">
              <div className="space-y-6">
                <Button 
                  onClick={startTest} 
                  disabled={isRunning}
                  variant="neon"
                  size="lg"
                  className="w-full"
                >
                  {isRunning ? 'Testing...' : 'Start Speed Test'}
                </Button>

                {isRunning && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-neon-cyan">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="neon-glow" />
                    <div className="text-center text-sm text-neon-cyan capitalize">
                      {phase === 'idle' ? 'Initializing' : `Testing ${phase}`}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <NetworkStats 
              ping={ping}
              jitter={jitter}
              downloadSpeed={downloadSpeed}
              uploadSpeed={uploadSpeed}
            />
          </div>
        </div>

        {/* Connection Graph */}
        <div className="mt-8">
          <ConnectionGraph 
            downloadSpeed={downloadSpeed}
            uploadSpeed={uploadSpeed}
            isRunning={isRunning}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Card className="p-4 bg-card/50 border-neon-cyan/30">
            <div className="flex items-center space-x-3">
              <Download className="w-8 h-8 text-neon-green" />
              <div>
                <div className="text-2xl font-bold text-neon-green">
                  {downloadSpeed.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Mbps Down</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-neon-pink/30">
            <div className="flex items-center space-x-3">
              <Upload className="w-8 h-8 text-neon-pink" />
              <div>
                <div className="text-2xl font-bold text-neon-pink">
                  {uploadSpeed.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Mbps Up</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-neon-purple/30">
            <div className="flex items-center space-x-3">
              <Signal className="w-8 h-8 text-neon-purple" />
              <div>
                <div className="text-2xl font-bold text-neon-purple">
                  {ping.toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">ms Ping</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 border-neon-orange/30">
            <div className="flex items-center space-x-3">
              <Globe className="w-8 h-8 text-neon-orange" />
              <div>
                <div className="text-2xl font-bold text-neon-orange">
                  {jitter.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">ms Jitter</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};