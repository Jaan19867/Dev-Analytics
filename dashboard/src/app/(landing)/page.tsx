import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GitHubLogoIcon, RocketIcon } from '@radix-ui/react-icons';
import { SiGooglemaps } from 'react-icons/si';
import { MdDevices } from 'react-icons/md';
import { TbDatabaseExport } from 'react-icons/tb';
import { GoLaw, GoGraph } from 'react-icons/go';
import { FaUserShield } from 'react-icons/fa6';
import { BsSpeedometer2 } from 'react-icons/bs';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IoPricetagsOutline } from 'react-icons/io5';

const githubUrl = 'https://github.com/ved-analytics';
const features = [
  {
    name: 'Real-Time Analytics',
    description: 'Get instant insights with real-time data on user behavior, demographics, and more.',
    logo: RocketIcon,
  },
  {
    name: 'Privacy-Focused',
    description: 'No cookies, no personal identifiers—completely compliant with GDPR, PECR, and other regulations.',
    logo: FaUserShield,
  },
  {
    name: 'User Demographics',
    description: "Detailed analysis of your audience's demographics, including location, language, and devices.",
    logo: SiGooglemaps,
  },
  {
    name: 'Bounce Rate Tracking',
    description: "Understand your site's engagement by tracking bounce rates and session duration.",
    logo: GoGraph,
  },
  {
    name: 'Browser & OS Insights',
    description: 'Get a breakdown of the browsers and operating systems your visitors are using.',
    logo: MdDevices,
  },
  {
    name: 'Compliance-First',
    description: 'Built with privacy laws in mind, ensuring your data practices are always above board.',
    logo: GoLaw,
  },
  {
    name: 'Lightweight & Fast',
    description: 'Minimal impact on performance, keeping your site fast and responsive.',
    logo: BsSpeedometer2,
  },
  {
    name: 'Cheap Pricing',
    description: 'Get more number of websites at cheap prices. No limit on number of websites !',
    logo: IoPricetagsOutline,
  },
  {
    name: 'Data Export',
    description: 'Easily export your analytics data in various formats for further analysis or sharing.',
    logo: TbDatabaseExport,
  },
];

const HomePage = () => {
  return (
    <div>
      <section className="mx-auto grid min-h-[calc(100vh-80px)] items-center">
        <div className="p-4">
          <div className="text-balance mb-10 mt-4 text-center text-muted-foreground md:text-lg lg:text-xl flex items-center justify-center">
            <a
              href="https://www.producthunt.com/posts/ved-analytics?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-ved&#0045;analytics"
              target="_blank"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=484229&theme=light"
                alt="Ved&#0032;Analytics - Privacy&#0032;focused&#0032;website&#0032;analytics&#0032;platform | Product Hunt"
                style={{ width: '250px', height: '54px' }}
                width="250"
                height="54"
              />
            </a>
          </div>
          <div className="mb-10 flex items-center justify-center gap-3">
            <div className="flex items-center justify-center text-4xl font-medium text-white">
              <RocketIcon className="mr-2 h-10 w-10" /> {'Ved'}
            </div>
          </div>
          <h1 className="text-balance text-center text-3xl font-bold md:text-4xl lg:text-5xl text-white">
            Handle Analytics Like A Pro!
          </h1>
          <p className="text-balance mb-10 mt-4 text-center text-muted-foreground md:text-lg lg:text-xl">
            A privacy focussed, cookie-free website analytics platform. Get real-time detailed analysis of your website
            which includes things like User Demographics, Bounce Rate, Browsers, OS etc
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="outline" className="text-white" asChild>
              <a href={githubUrl} className="text-white">
                <GitHubLogoIcon className="mr-1 h-5 w-5" />
                GitHub
              </a>
            </Button>
            <Button size="lg" asChild>
              <Link href="/login"> Get Started</Link>
            </Button>
          </div>
        </div>
      </section>
      <section>
        <div className="container mx-auto lg:max-w-screen-lg">
          <h1 className="mb-4 text-center text-3xl font-bold md:text-4xl lg:text-5xl text-white">
            <a id="features"></a> Features
          </h1>
          <p className="text-balance mb-10 text-center text-muted-foreground md:text-lg lg:text-xl">
            Privacy focussed, lightweight cookie free website analytics platform, ensuring compliance with GDPR, PECR,
            and other regulations.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.name}>
                <div className="pl-6 pt-6">
                  <feature.logo className="h-12 w-12" />
                </div>
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl">{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
