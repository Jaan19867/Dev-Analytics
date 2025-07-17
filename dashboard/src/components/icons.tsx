import { forwardRef, type SVGProps } from 'react';
import { cn } from '@/lib/utils';

const AnimatedSpinner = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    {...props}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    className={cn(className)}
  >
    <g className="animated-spinner">
      <rect x="11" y="1" width="2" height="5" opacity=".14" />
      <rect x="11" y="1" width="2" height="5" transform="rotate(30 12 12)" opacity=".29" />
      <rect x="11" y="1" width="2" height="5" transform="rotate(60 12 12)" opacity=".43" />
      <rect x="11" y="1" width="2" height="5" transform="rotate(90 12 12)" opacity=".57" />
      <rect x="11" y="1" width="2" height="5" transform="rotate(120 12 12)" opacity=".71" />
      <rect x="11" y="1" width="2" height="5" transform="rotate(150 12 12)" opacity=".86" />
      <rect x="11" y="1" width="2" height="5" transform="rotate(180 12 12)" />
    </g>
  </svg>
));
AnimatedSpinner.displayName = 'AnimatedSpinner';

const CreditCard = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(({ className, ...props }, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
    viewBox="0 0 24 24"
    className={cn(className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
    <line x1="2" y1="10" x2="22" y2="10"></line>
  </svg>
));
CreditCard.displayName = 'CreditCard';

const NewTab = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(({ className, ...props }, ref) => (
  <svg
    ref={ref}
    className={`inline-block ${className}`}
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
));

NewTab.displayName = 'NewTab';

function LineChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary">
      <path
        d="M4 18L9 13L13 17L20 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LessThan() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill="currentColor">
      <path d="M14.71 6.71L10.42 12l4.29 5.29L13.29 18l-5-6 5-6z" />
    </svg>
  );
}

export { AnimatedSpinner, CreditCard, NewTab, LineChart, LessThan };

export {
  EyeOpenIcon,
  EyeNoneIcon as EyeCloseIcon,
  SunIcon,
  MoonIcon,
  ExclamationTriangleIcon,
  ExitIcon,
  EnterIcon,
  BarChartIcon,
  GearIcon,
  RocketIcon,
  PlusIcon,
  HamburgerMenuIcon,
  Pencil2Icon,
  UpdateIcon,
  CheckCircledIcon,
  PlayIcon,
  TrashIcon,
  ArchiveIcon,
  ResetIcon,
  DiscordLogoIcon,
  FileTextIcon,
  IdCardIcon,
  PlusCircledIcon,
  FilePlusIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
  ArrowLeftIcon,
  GitHubLogoIcon,
} from '@radix-ui/react-icons';
