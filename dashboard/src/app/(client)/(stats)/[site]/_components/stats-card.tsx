'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTimeline } from '@/store/timeline.context';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const PercentageDisplay = ({ text, value1, value2 }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const percentage = Math.min(Math.max(value2, 0), 100);

  return (
    <div
      style={{
        padding: '10px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: isHovered ? '#1f2b40' : 'transparent',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '16px' }}>
        <div style={{ marginRight: '10px' }}>{text}</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isHovered && <div style={{ marginRight: '10px', color: '#888', fontSize: '13px' }}>{`${percentage}%`}</div>}
          <div className="ml-2 text-base">{value1}</div>
        </div>
      </div>
      <div style={{ height: '1px', width: '100%', backgroundColor: '#f3f3f3', borderRadius: '5px', marginTop: '10px' }}>
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: '#4caf50',
            borderRadius: '5px',
          }}
        />
      </div>
    </div>
  );
};

export default function StatsCard({ name }: any) {
  const [pageVisitors, setPageVisitors] = useState([]);
  const [referrers, setReferrers] = useState([]);
  const [browsers, setBrowsers] = useState([]);
  const [os, setOs] = useState([]);
  const [devices, setDevices] = useState([]);
  const [countries, setCountries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const period = useTimeline();
  const getTop5Time = (data: any[]) => data.sort((a, b) => b.averageTimeSpent - a.averageTimeSpent).slice(0, 5);
  const sumTotalTime = (data: any[]) => data.reduce((acc, item) => acc + (item.totalTime || 0), 0);
  const getTop5TotalEvents = (data: any[]) => data.sort((a, b) => b.totalEvents - a.totalEvents).slice(0, 5);
  const getTop5VisitFalseCount = (data: any[]) =>
    data.sort((a, b) => b.visitFalseCount - a.visitFalseCount).slice(0, 5);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageVisitorsRes, referrersRes, browsersRes, osRes, devicesRes, countriesRes, languagesRes] =
          await Promise.all([
            fetch(`https://backend.vedanalytics.in/api/${name}/pages?period=${period?.timeline}`),
            fetch(`https://backend.vedanalytics.in/api/${name}/referrers?period=${period?.timeline}`),
            fetch(`https://backend.vedanalytics.in/api/${name}/browsers?period=${period?.timeline}`),
            fetch(`https://backend.vedanalytics.in/api/${name}/os?period=${period?.timeline}`),
            fetch(`https://backend.vedanalytics.in/api/${name}/devices?period=${period?.timeline}`),
            fetch(`https://backend.vedanalytics.in/api/${name}/countries?period=${period?.timeline}`),
            fetch(`https://backend.vedanalytics.in/api/${name}/languages?period=${period?.timeline}`),
          ]);

        const [pageVisitorsData, referrersData, browsersData, osData, devicesData, countriesData, languagesData] =
          await Promise.all([
            pageVisitorsRes.json(),
            referrersRes.json(),
            browsersRes.json(),
            osRes.json(),
            devicesRes.json(),
            countriesRes.json(),
            languagesRes.json(),
          ]);
        setPageVisitors(pageVisitorsData);
        setReferrers(referrersData);
        setBrowsers(browsersData);
        setOs(osData);
        setDevices(devicesData);
        setCountries(countriesData);
        setLanguages(languagesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [name, period?.timeline]);

  const toppageVisitors = getTop5TotalEvents(pageVisitors);
  const toptime = getTop5Time(pageVisitors);
  const topreferrers = getTop5VisitFalseCount(referrers);
  const topbrowsers = getTop5VisitFalseCount(browsers);
  const topos = getTop5VisitFalseCount(os);
  const topdevices = getTop5VisitFalseCount(devices);
  const topcountries = getTop5VisitFalseCount(countries);
  const toplanguages = getTop5VisitFalseCount(languages);
  const sum = sumTotalTime(pageVisitors);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
      <Card className="relative">
        <div className="absolute top-0 left-0 right-0 h-[40px] bg-muted z-0"></div>
        <Tabs defaultValue="pages" className="relative z-10 top-0">
          <TabsList>
            <TabsTrigger value="pages"> Pages </TabsTrigger>
            <TabsTrigger value="time"> Time </TabsTrigger>
          </TabsList>
          <TabsContent value="pages" className="min-h-[280px]">
            <div className="flex-grow min-h-[280px]">
              {toppageVisitors.map((item, index) => (
                <PercentageDisplay
                  key={index}
                  text={item.path}
                  value1={item.totalEvents}
                  value2={item.eventPercentage.toFixed(2)}
                />
              ))}
            </div>
            <br />
            <Link href={`/${name}/stats?key=pages`}>
              <Button className="w-full mt-2" variant={`outline`}>
                Load More
              </Button>
            </Link>
          </TabsContent>
          <TabsContent value="time" className="min-h-[280px]">
            <div className="flex-grow min-h-[280px]">
              {toptime.map((item, index) => (
                <PercentageDisplay
                  key={index}
                  text={item.path}
                  value1={(item.averageTimeSpent / 1000).toFixed(2) + ' s'}
                  value2={(((item.averageTimeSpent * item.totalEvents) / sum) * 100).toFixed(2)}
                />
              ))}
            </div>
            <br />
            <Link href={`/${name}/stats?key=pages`}>
              <Button className="w-full mt-2" variant={`outline`}>
                Load More
              </Button>
            </Link>
          </TabsContent>
        </Tabs>
      </Card>
      <Card className="relative">
        <div className="absolute top-0 left-0 right-0 h-[40px] bg-muted z-0"></div>
        <Tabs defaultValue="referrers" className="top-0 relative z-10">
          <TabsList>
            <TabsTrigger value="referrers">Referrers</TabsTrigger>
          </TabsList>
          <TabsContent value="referrers" className="min-h-[280px]">
            <div className="flex-grow min-h-[280px]">
              {topreferrers.map((item, index) => (
                <PercentageDisplay
                  key={index}
                  text={item.referrers}
                  value1={item.visitFalseCount}
                  value2={item.visitFalseCountPercentage ? item.visitFalseCountPercentage.toFixed(2) : 0}
                />
              ))}
            </div>
            <br />
            <Link href={`/${name}/stats?key=referrers`}>
              <Button className="w-full mt-2" variant={`outline`}>
                Load More
              </Button>
            </Link>
          </TabsContent>
        </Tabs>
      </Card>
      <Card className="relative">
        <div className="absolute top-0 left-0 right-0 h-[40px] bg-muted z-0"></div>
        <Tabs defaultValue="browsers" className="top-0 z-10 relative">
          <TabsList>
            <TabsTrigger value="browsers">Browsers</TabsTrigger>
            <TabsTrigger value="os">OS</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>
          <TabsContent value="browsers" className="min-h-[280px]">
            <div className="flex-grow min-h-[280px]">
              {topbrowsers.map((item, index) => (
                <PercentageDisplay
                  key={index}
                  text={item.browser}
                  value1={item.visitFalseCount}
                  value2={item.visitFalseCountPercentage ? item.visitFalseCountPercentage.toFixed(2) : 0}
                />
              ))}
            </div>
            <br />
            <Link href={`/${name}/stats?key=browsers`}>
              <Button className="w-full mt-2" variant={`outline`}>
                Load More
              </Button>
            </Link>
          </TabsContent>
          <TabsContent value="os" className="min-h-[280px]">
            <div className="flex-grow min-h-[280px]">
              {topos.map((item, index) => (
                <PercentageDisplay
                  key={index}
                  text={item.operatingsystem}
                  value1={item.visitFalseCount}
                  value2={item.visitFalseCountPercentage ? item.visitFalseCountPercentage.toFixed(2) : 0}
                />
              ))}
            </div>
            <br />
            <Link href={`/${name}/stats?key=os`}>
              <Button className="w-full mt-2" variant={`outline`}>
                Load More
              </Button>
            </Link>
          </TabsContent>
          <TabsContent value="devices" className="min-h-[280px]">
            <div className="flex-grow min-h-[280px]">
              {topdevices.map((item, index) => (
                <PercentageDisplay
                  key={index}
                  text={item.device}
                  value1={item.visitFalseCount}
                  value2={item.visitFalseCountPercentage ? item.visitFalseCountPercentage.toFixed(2) : 0}
                />
              ))}
            </div>
            <br />
            <Link href={`/${name}/stats?key=devices`}>
              <Button className="w-full mt-2" variant={`outline`}>
                Load More
              </Button>
            </Link>
          </TabsContent>
        </Tabs>
      </Card>
      <Card className="relative">
        <div className="absolute top-0 left-0 right-0 h-[40px] bg-muted z-0"></div>
        <Tabs defaultValue="countries" className="top-0 z-10 relative">
          <TabsList>
            <TabsTrigger value="countries">Countries</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
          </TabsList>
          <TabsContent value="countries" className="min-h-[280px]">
            <div className="flex-grow min-h-[280px]">
              {topcountries.map((item, index) => (
                <PercentageDisplay
                  key={index}
                  text={item.country}
                  value1={item.visitFalseCount}
                  value2={item.visitFalseCountPercentage ? item.visitFalseCountPercentage.toFixed(2) : 0}
                />
              ))}
            </div>
            <br />
            <Link href={`/${name}/stats?key=countries`}>
              <Button className="w-full mt-2" variant={`outline`}>
                Load More
              </Button>
            </Link>
          </TabsContent>
          <TabsContent value="languages" className="min-h-[280px]">
            <div className="flex-grow min-h-[280px]">
              {toplanguages.map((item, index) => (
                <PercentageDisplay
                  key={index}
                  text={item.language}
                  value1={item.visitFalseCount}
                  value2={item.visitFalseCountPercentage ? item.visitFalseCountPercentage.toFixed(2) : 0}
                />
              ))}
            </div>
            <br />
            <Link href={`/${name}/stats?key=languages`}>
              <Button className="w-full mt-2" variant={`outline`}>
                Load More
              </Button>
            </Link>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
