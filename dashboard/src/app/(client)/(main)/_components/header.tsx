import Link from 'next/link';
import { RocketIcon } from '@/components/icons';
import { APP_TITLE } from '@/lib/constants';
import { useRouter } from 'next/navigation';

import { UserDropdown } from '@/app/(client)/(main)/_components/user-dropdown';

export const Header = ({ user }: { user: { email: string; avatar: string } }) => {
  return (
    <header className="sticky top-0 border-b bg-black p-0 z-20">
      <div className="container flex items-center gap-2 px-2 py-2 lg:px-4">
        <Link href={`/dashboard`} className="flex items-center justify-center text-xl font-medium text-white">
          <RocketIcon className="mr-2 h-5 w-5" /> {APP_TITLE}
        </Link>
        <UserDropdown email={user.email} avatar={user.avatar} className="ml-auto" />
      </div>
    </header>
  );
};
