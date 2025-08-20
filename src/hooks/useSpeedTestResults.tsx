import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface SpeedTestResult {
  id: string;
  download_speed: number;
  upload_speed: number;
  ping: number;
  jitter: number;
  server_location: string;
  isp?: string;
  ip_address?: string;
  connection_type: string;
  test_duration?: number;
  created_at: string;
}

export const useSpeedTestResults = () => {
  const [results, setResults] = useState<SpeedTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const saveTestResult = useCallback(async (result: Omit<SpeedTestResult, 'id' | 'created_at'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your test results.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('speed_test_results')
        .insert([
          {
            user_id: user.id,
            download_speed: result.download_speed,
            upload_speed: result.upload_speed,
            ping: result.ping,
            jitter: result.jitter,
            server_location: result.server_location,
            isp: result.isp,
            ip_address: result.ip_address,
            connection_type: result.connection_type,
            test_duration: result.test_duration,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Test Saved",
        description: "Your speed test result has been saved successfully.",
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save test result.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const fetchTestResults = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('speed_test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setResults(data || []);
    } catch (error: any) {
      toast({
        title: "Load Failed",
        description: error.message || "Failed to load test results.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const getStats = useCallback(() => {
    if (results.length === 0) return null;

    const avgDownload = results.reduce((acc, result) => acc + result.download_speed, 0) / results.length;
    const avgUpload = results.reduce((acc, result) => acc + result.upload_speed, 0) / results.length;
    const avgPing = results.reduce((acc, result) => acc + result.ping, 0) / results.length;
    const maxDownload = Math.max(...results.map(r => r.download_speed));
    const maxUpload = Math.max(...results.map(r => r.upload_speed));

    return {
      avgDownload,
      avgUpload,
      avgPing,
      maxDownload,
      maxUpload,
      totalTests: results.length,
    };
  }, [results]);

  return {
    results,
    loading,
    saveTestResult,
    fetchTestResults,
    getStats,
  };
};