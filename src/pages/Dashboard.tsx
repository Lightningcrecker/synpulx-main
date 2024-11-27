import React from 'react';
import { Activity, Brain, Heart, TrendingUp, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { HealthSummary } from '../components/dashboard/HealthSummary';
import { ActivityChart } from '../components/dashboard/ActivityChart';
import { RecentMetrics } from '../components/dashboard/RecentMetrics';
import { useWearableData } from '../hooks/useWearableData';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { latestData } = useWearableData();

  return (
    <DashboardLayout>
      <div className="p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {user?.name || 'User'}
          </h1>
          <p className="text-gray-400">
            Here's your real-time health metrics and activities
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: Heart,
              title: 'Heart Rate',
              value: `${latestData?.heartRate || '--'} bpm`,
              change: latestData?.heartRateChange || '+0%',
              positive: (latestData?.heartRateChange || 0) >= 0
            },
            {
              icon: Activity,
              title: 'Daily Steps',
              value: latestData?.steps?.toLocaleString() || '--',
              change: latestData?.stepsChange || '+0%',
              positive: true
            },
            {
              icon: Brain,
              title: 'Sleep Quality',
              value: `${latestData?.sleepScore || '--'}%`,
              change: latestData?.sleepChange || '+0%',
              positive: (latestData?.sleepChange || 0) >= 0
            },
            {
              icon: TrendingUp,
              title: 'Weekly Progress',
              value: `${latestData?.weeklyScore || '--'}%`,
              change: latestData?.weeklyChange || '+0%',
              positive: (latestData?.weeklyChange || 0) >= 0
            }
          ].map((metric, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <div className="flex items-start justify-between">
                <metric.icon className="h-8 w-8 text-blue-400" />
                <span className={`text-sm ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {metric.change}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mt-4">{metric.title}</h3>
              <p className="text-2xl font-bold text-white mt-2">{metric.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityChart />
          </div>
          <div>
            <RecentMetrics />
          </div>
        </div>

        <div className="mt-8">
          <HealthSummary />
        </div>
      </div>
    </DashboardLayout>
  );
};