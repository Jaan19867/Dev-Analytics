import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useChartType } from '@/store/chart.context';
import { Tooltip } from '@mantine/core';

interface summaryData {
  uniqueVisitors: number;
  totalEvents: number;
  bounceRate: number;
  averageTimeSpent: number;
}

export default function Component({ back, current }: { back: summaryData[]; current: summaryData[] }) {
  const chartType = useChartType();

  const calculatePercentageDifference = (currentValue: number, previousValue: number) => {
    if (previousValue === 0) return currentValue > 0 ? '100%' : '0%';
    const difference = ((currentValue - previousValue) / previousValue) * 100;
    return Math.abs(difference).toFixed(2) + '%';
  };

  return (
    <ScrollArea className="w-full max-w-5xl mx-auto pt-12 pl-2 pr-2">
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
        <div className="flex-none w-[200px] snap-start">
          <Tooltip
            label={
              back[0].uniqueVisitors > current[0].uniqueVisitors
                ? `${calculatePercentageDifference(current[0].uniqueVisitors, back[0].uniqueVisitors)} less than previous period`
                : `${calculatePercentageDifference(current[0].uniqueVisitors, back[0].uniqueVisitors)} more than previous period`
            }
            onClick={() => chartType?.setClicked('uniqueVisitors')}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow w-[200px]">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{current[0].uniqueVisitors}</h3>
                <p className="text-muted-foreground text-sm">Visitors</p>
              </CardContent>
            </Card>
          </Tooltip>
        </div>
        <div className="flex-none w-[200px] snap-start">
          <Tooltip
            label={
              back[0].totalEvents > current[0].totalEvents
                ? `${calculatePercentageDifference(current[0].totalEvents, back[0].totalEvents)} less than previous period`
                : `${calculatePercentageDifference(current[0].totalEvents, back[0].totalEvents)} more than previous period`
            }
            onClick={() => chartType?.setClicked('totalEvents')}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow w-[200px]">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{current[0].totalEvents}</h3>
                <p className="text-muted-foreground text-sm">Page Views</p>
              </CardContent>
            </Card>
          </Tooltip>
        </div>
        <div className="flex-none w-[200px] snap-start">
          <Tooltip
            label={
              back[0].averageTimeSpent > current[0].averageTimeSpent
                ? `${calculatePercentageDifference(current[0].averageTimeSpent, back[0].averageTimeSpent)} less than previous period`
                : `${calculatePercentageDifference(current[0].averageTimeSpent, back[0].averageTimeSpent)} more than previous period`
            }
            onClick={() => chartType?.setClicked('averageTimeSpent')}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow w-[200px]">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{(current[0].averageTimeSpent / 1000).toFixed(2)} secs</h3>
                <p className="text-muted-foreground text-sm">Time Spent</p>
              </CardContent>
            </Card>
          </Tooltip>
        </div>
        <div className="flex-none w-[200px] snap-start">
          <Tooltip
            label={
              back[0].bounceRate > current[0].bounceRate
                ? `${calculatePercentageDifference(current[0].bounceRate, back[0].bounceRate)} less than previous period`
                : `${calculatePercentageDifference(current[0].bounceRate, back[0].bounceRate)} more than previous period`
            }
            onClick={() => chartType?.setClicked('bounceRate')}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow w-[200px]">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold">{(current[0].bounceRate * 100).toFixed(2)} %</h3>
                <p className="text-muted-foreground text-sm">Bounce Rate</p>
              </CardContent>
            </Card>
          </Tooltip>
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
