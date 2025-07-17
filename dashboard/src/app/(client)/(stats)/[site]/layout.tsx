'use client';
import { useChartType } from '@/store/chart.context';
import SiteSummary from './_components/site-summary';
import { Chart, ChartData } from './_components/chart';
import { useUser } from '@/store/userId.context';
import { Header } from '../../(main)/_components/header';
import { useEffect, useState } from 'react';
import { website } from '@/store/website.context';
import { getUserData } from '@/lib/actions';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTimeline } from '@/store/timeline.context';
interface OriginalItem {
  date: string;
  [key: string]: any;
}

interface TransformedItem {
  date: string;
  value: any;
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { site: string };
}>) {
  const [getuser, setgetUser] = useState<{ login: string; avatar_url: string; websites: website[] } | null>(null);
  const chartType = useChartType();
  const user = useUser();
  const timeline = useTimeline();
  const [summaryData, setSummaryData] = useState({
    current: [
      {
        uniqueVisitors: 0,
        totalEvents: 0,
        bounceRate: 0,
        averageTimeSpent: 0,
      },
    ],
    previous: [
      {
        uniqueVisitors: 0,
        totalEvents: 0,
        bounceRate: 0,
        averageTimeSpent: 0,
      },
    ],
    interval: [
      {
        date: new Date().toISOString(),
        uniqueVisitors: 0,
        totalEvents: 0,
        bounceRate: 0,
        averageTimeSpent: 0,
      },
    ],
  });

  useEffect(() => {
    if (user?.user.userId === '') {
      const accessToken = localStorage.getItem('githubAccessToken');
      if (accessToken) {
        getUserData(accessToken)
          .then((data) => {
            setgetUser({
              login: data.login,
              avatar_url: data.avatar_url,
              websites: data.websites,
            });
            user.setUser({
              userId: data.login,
              avatar: data.avatar_url,
              isPremium: data.user.isPremium ? true : false,
              isFreeTrial: data.user.isFreeTrial ? true : false,
              premiumDate: new Date(data.user.isPremium),
              freeTrialDate: new Date(data.user.isFreeTrial),
              premiumType: data.user.premiumType,
            });
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      } else {
        redirect('/');
      }
    }

    fetch(`http://localhost:3001/api/${params.site}/summary?period=${timeline?.timeline}`)
      .then((res) => res.json())
      .then((data) => {
        const calculateAverageTime = (arr: any[]) => {
          if (arr.length === 0) return 0;
          const totalTime = arr.reduce((sum, item) => sum + item.averageTimeSpent, 0);
          return totalTime / arr.length;
        };

        const averageTimeCurrent = calculateAverageTime(data.current);
        const averageTimePrevious = calculateAverageTime(data.previous);
        console.log(averageTimeCurrent, averageTimePrevious)
        setSummaryData((prev) => ({
          // ...prev,
          current: data.current.map((item: { averageTimeSpent: any }) => ({
            ...item,
            averageTimeSpent: averageTimeCurrent,
          })),
          previous: data.previous.map((item: { averageTimeSpent: any }) => ({
            ...item,
            averageTimeSpent: averageTimePrevious,
          })),
          interval: data.interval,
        }));
      })
      .catch((error) => {
        console.error('Error fetching summary data:', error);
      });
  }, [params.site, timeline?.timeline, user]);

  function transformArray<T extends OriginalItem>(array: T[]): TransformedItem[] {
    return array.map((obj) => {
      const [key] = Object.keys(obj).filter((k) => k !== 'date');
      return {
        date: obj.date,
        value: obj[key],
      };
    });
  }

  function filterKeys<T extends object>(array: T[], keysToKeep: (keyof T)[]): Partial<T>[] {
    return array.map((obj) => {
      return Object.fromEntries(
        Object.entries(obj).filter(([key]) => keysToKeep.includes(key as keyof T))
      ) as Partial<T>;
    });
  }

  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-black font-sans antialiased')}>
        <Header
          user={{
            email: user!.user.userId,
            avatar: user!.user.avatar,
          }}
        />
        <div className="w-full">
          <SiteSummary data={summaryData} />
          <div className="max-w-[1200px] mx-auto mt-24 pr-2">
            {chartType?.checked ? (
              chartType.clicked === 'uniqueVisitors' ? (
                <Chart
                  type="bar"
                  label="Visitors"
                  data={
                    transformArray(
                      filterKeys(summaryData.interval, ['uniqueVisitors', 'date']) as OriginalItem[]
                    ) as ChartData[]
                  }
                />
              ) : chartType.clicked === 'totalEvents' ? (
                <Chart
                  type="bar"
                  label="Page Views"
                  data={
                    transformArray(
                      filterKeys(summaryData.interval, ['totalEvents', 'date']) as OriginalItem[]
                    ) as ChartData[]
                  }
                />
              ) : chartType.clicked === 'averageTimeSpent' ? (
                <Chart
                  type="bar"
                  label="Time Spent"
                  data={
                    transformArray(
                      filterKeys(summaryData.interval, ['averageTimeSpent', 'date']) as OriginalItem[]
                    ) as ChartData[]
                  }
                />
              ) : (
                <Chart
                  type="bar"
                  label="Bounce Rate"
                  data={
                    transformArray(
                      filterKeys(summaryData.interval, ['bounceRate', 'date']) as OriginalItem[]
                    ) as ChartData[]
                  }
                />
              )
            ) : chartType?.clicked === 'uniqueVisitors' ? (
              <Chart
                type="area"
                label="Visitors"
                data={
                  transformArray(
                    filterKeys(summaryData.interval, ['uniqueVisitors', 'date']) as OriginalItem[]
                  ) as ChartData[]
                }
              />
            ) : chartType?.clicked === 'totalEvents' ? (
              <Chart
                type="area"
                label="Page Views"
                data={
                  transformArray(
                    filterKeys(summaryData.interval, ['totalEvents', 'date']) as OriginalItem[]
                  ) as ChartData[]
                }
              />
            ) : chartType?.clicked === 'averageTimeSpent' ? (
              <Chart
                type="area"
                label="Time Spent"
                data={
                  transformArray(
                    filterKeys(summaryData.interval, ['averageTimeSpent', 'date']) as OriginalItem[]
                  ) as ChartData[]
                }
              />
            ) : (
              <Chart
                type="area"
                label="Bounce Rate"
                data={
                  transformArray(
                    filterKeys(summaryData.interval, ['bounceRate', 'date']) as OriginalItem[]
                  ) as ChartData[]
                }
              />
            )}
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
