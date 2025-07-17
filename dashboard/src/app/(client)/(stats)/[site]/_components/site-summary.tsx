'use client';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React from 'react';
import Component from './summary-cards';
import { Switch, Tooltip } from '@mantine/core';
import { BarChartIcon, LineChart } from '@/components/icons';
import { useWindowSize } from 'react-use';
import { useChartType } from '@/store/chart.context';
import { useTimeline } from '@/store/timeline.context';

const frameworks = [
  {
    value: 'today',
    label: 'Today',
  },
  {
    value: 'yesterday',
    label: 'Yesterday',
  },
  {
    value: '12h',
    label: '12 Hours',
  },
  {
    value: '24h',
    label: '24 Hours',
  },
  {
    value: '72h',
    label: '72 Hours',
  },
  {
    value: '7d',
    label: '7 Days',
  },
  {
    value: '14d',
    label: '14 Days',
  },
  {
    value: '30d',
    label: '30 Days',
  },
  {
    value: 'quarter',
    label: 'Quater',
  },
  {
    value: 'halfyear',
    label: 'Half Year',
  },
  {
    value: 'year',
    label: 'Year',
  },
];

function ComboboxDemo() {
  const timeline = useTimeline();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="ml-auto mt-2 text-white">
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between text-white">
          {timeline?.timeline
            ? frameworks.find((framework) => framework.value === timeline.timeline)?.label
            : 'Select timeline...'}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 text-white">
        <Command>
          <CommandList>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  className="text-white"
                  onSelect={(currentValue) => {
                    timeline?.setTimeline(currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4 text-white',
                      timeline?.timeline === framework.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const SiteSummary = (data: any) => {
  const { width } = useWindowSize();
  const chartType = useChartType();
  const current = data!.data.current;
  const back = data.data.previous;

  return width > 1250 ? (
    <div className="h-[310px] border-b">
      <div className="w-full mx-auto text-2xl container flex items-center gap-2 px-2 pt-6 lg:px-4 text-white">
        Dashboard
        <ComboboxDemo />
      </div>
      <Component current={current} back={back} />
      <Switch
        size="lg"
        color="black"
        onLabel={<BarChartIcon />}
        offLabel={<LineChart />}
        className="ml-[80vw] text-white"
        label="Switch Chart Layout"
        checked={chartType?.checked}
        onChange={(event) => chartType?.setChartType(event.currentTarget.checked)}
        style={(theme) => ({
          track: {
            backgroundColor: chartType?.checked ? theme.colors.black : theme.colors.black,
          },
        })}
      />
    </div>
  ) : (
    <div className="h-[310px] border-b">
      <div className="w-full mx-auto text-2xl container flex items-center gap-2 px-2 pt-6 lg:px-4 text-white">
        Dashboard
        <ComboboxDemo />
      </div>
      <Component current={current} back={back} />
      <Tooltip label="Switch Chart Layout" refProp="rootRef" className="text-white">
        <Switch
          size="lg"
          onLabel={<BarChartIcon />}
          offLabel={<LineChart />}
          className="ml-[80vw]"
          checked={chartType?.checked}
          onChange={(event) => chartType?.setChartType(event.currentTarget.checked)}
        />
      </Tooltip>
    </div>
  );
};

export default SiteSummary;
