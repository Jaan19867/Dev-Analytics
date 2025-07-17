'use client';
import { ScrollArea, Tabs } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { LessThan } from '@/components/icons';
import { useTimeline } from '@/store/timeline.context';
import {
  Browsers,
  Countries,
  DataTable,
  Devices,
  Languages,
  Os,
  Pages,
  Referrers,
  browsercolummns,
  colummns,
  countriescolummns,
  devicecolummns,
  languagecolummns,
  oscolummns,
  pagecolummns,
} from './table';
import Link from 'next/link';
import { useScreenWidth } from '../../../../../../hooks/useScreenWidth';

function StatDetails({ defaultValue, site }: { defaultValue: string; site: string }) {
  const timeline = useTimeline();
  const [activeTab, setActiveTab] = useState(defaultValue);
  const [data, setData] = useState<Pages[] | Referrers[] | Countries[] | Browsers[] | Os[] | Languages[] | Devices[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const screenWidth = useScreenWidth();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/${site}/${activeTab}?period=${timeline?.timeline}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((dat) => {
        let finalData = dat;
        const languageNames = new Intl.DisplayNames(['en'], {
          type: 'language',
        });
        if (activeTab === 'languages') {
          finalData = dat.map((item: any) => ({
            ...item,
            language: languageNames.of(item.language) || item.language,
          }));
        }
        setData(finalData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        setLoading(false);
      });
  }, [activeTab, site, timeline?.timeline]);

  const handleTabChange = (value: string | null) => {
    if (value !== activeTab) {
      setLoading(true);
      setActiveTab(value!);
    }
  };

  return (
    <div className="relative h-[400px] mt-40 mb-64">
      <div className="border max-w-[1200px] mx-auto flex h-10 items-center text-white">
        <Link href="/dashboard" className="flex text-white">
          <LessThan /> Go Back
        </Link>
      </div>
      <Tabs
        defaultValue={defaultValue}
        orientation="vertical"
        className="max-w-[1200px] mx-auto relative border"
        value={activeTab}
        onChange={handleTabChange}
        styles={(theme) => ({
          tab: {
            color: '#d1d5db',
            '&[data-active]': {
              backgroundColor: 'bg-muted',
            },
          },
          tabLabel: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tabs.List>
          <Tabs.Tab value="pages" className="w-30">
            Pages
          </Tabs.Tab>
          <Tabs.Tab value="referrers">Referrers</Tabs.Tab>
          <Tabs.Tab value="browsers">Browsers</Tabs.Tab>
          <Tabs.Tab value="os">OS</Tabs.Tab>
          <Tabs.Tab value="devices">Devices</Tabs.Tab>
          <Tabs.Tab value="countries">Countries</Tabs.Tab>
          <Tabs.Tab value="languages">Languages</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pages">
          {loading ? (
            <div className="flex justify-center items-center h-full">Loading...</div>
          ) : (
            <ScrollArea style={{ width: Math.min(screenWidth - 100, 1090), height: '100%' }} className="mr-30">
              <DataTable columns={pagecolummns} data={data as Pages[]} />
            </ScrollArea>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="referrers">
          {loading ? (
            <div className="flex justify-center items-center h-full w-screen">Loading...</div>
          ) : (
            <ScrollArea style={{ width: Math.min(screenWidth - 100, 1090), height: '100%' }} className="mr-30">
              <DataTable columns={colummns} data={data as Referrers[]} />
            </ScrollArea>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="browsers">
          {loading ? (
            <div className="flex justify-center items-center h-full">Loading...</div>
          ) : (
            <ScrollArea style={{ width: Math.min(screenWidth - 100, 1090), height: '100%' }} className="mr-30">
              <DataTable columns={browsercolummns} data={data as Browsers[]} />
            </ScrollArea>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="os">
          {loading ? (
            <div className="flex justify-center items-center h-full">Loading...</div>
          ) : (
            <ScrollArea style={{ width: Math.min(screenWidth - 100, 1090), height: '100%' }} className="mr-30">
              <DataTable columns={oscolummns} data={data as Os[]} />
            </ScrollArea>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="devices">
          {loading ? (
            <div className="flex justify-center items-center h-full">Loading...</div>
          ) : (
            <ScrollArea style={{ width: Math.min(screenWidth - 100, 1090), height: '100%' }} className="mr-30">
              <DataTable columns={devicecolummns} data={data as Devices[]} />
            </ScrollArea>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="countries">
          {loading ? (
            <div className="flex justify-center items-center h-full">Loading...</div>
          ) : (
            <ScrollArea style={{ width: Math.min(screenWidth - 100, 1090), height: '100%' }} className="mr-30">
              <DataTable columns={countriescolummns} data={data as Countries[]} />
            </ScrollArea>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="languages">
          {loading ? (
            <div className="flex justify-center items-center h-full">Loading...</div>
          ) : (
            <ScrollArea style={{ width: Math.min(screenWidth - 100, 1090), height: '100%' }} className="mr-30">
              <DataTable columns={languagecolummns} data={data as Languages[]} />
            </ScrollArea>
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default StatDetails;
