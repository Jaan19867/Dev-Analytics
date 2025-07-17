'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileTextIcon, CreditCard, GearIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { TbDatabaseExport } from 'react-icons/tb';
import { KeyIcon } from 'lucide-react';

const items = [
  {
    title: 'Websites',
    href: '/dashboard',
    icon: FileTextIcon,
  },

  {
    title: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard,
  },
  // {
  //   title: 'Keys',
  //   href: '/dashboard/keys',
  //   icon: KeyIcon,
  // },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: GearIcon,
  },
  {
    title: 'Docs',
    href: 'https://docs.vedanalytics.in',
    icon: TbDatabaseExport,
  },
];

interface Props {
  className?: string;
}

export function DashboardNav({ className }: Props) {
  const path = usePathname();

  return (
    <nav className={cn(className)}>
      {items.map((item) => (
        <Link href={item.href} key={item.href}>
          <span
            className={cn(
              'group flex items-center rounded-md px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground text-white',
              path === item.href ? 'bg-accent' : 'transparent'
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
