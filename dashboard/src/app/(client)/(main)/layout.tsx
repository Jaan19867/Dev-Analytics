'use client';
import type { Viewport } from 'next';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { Header } from './_components/header';
import { Footer } from './_components/footer';
import { useState, useEffect } from 'react';
import { getUserData } from '@/lib/actions';
import { redirect } from 'next/navigation';
import { useWebsites, website } from '@/store/website.context';
import { useUser } from '@/store/userId.context';
import { Toaster } from '@/components/ui/toaster';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<{ login: string; avatar_url: string; websites: website[] } | null>(null);
  const { setWebsites } = useWebsites();
  const userI = useUser();
  useEffect(() => {
    const accessToken = localStorage.getItem('githubAccessToken');
    if (accessToken) {
      getUserData(accessToken)
        .then((data) => {
          setUser({
            login: data.login,
            avatar_url: data.avatar_url,
            websites: data.websites,
          });
          setWebsites(data.websites);
          userI?.setUser({
            userId: data.login,
            avatar: data.avatar_url,
            isPremium: data.user.isPremium ? true : false,
            isFreeTrial: data.user.isFreeTrial ? true : false,
            premiumDate: data.user.isPremium,
            freeTrialDate: data.user.isFreeTrial,
            premiumType: data.user.premiumType,
          });
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    } else {
      redirect('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-black font-sans antialiased')}>
        {user ? (
          <div>
            <Header
              user={{
                email: user.login,
                avatar: user.avatar_url,
              }}
            />
            {children}
            <Toaster />
            <Footer />
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="h-24 w-24">
              <circle fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="18" r="15" cx="40" cy="65">
                <animate
                  attributeName="cy"
                  calcMode="spline"
                  dur="2s"
                  values="65;135;65;"
                  keySplines=".5 0 .5 1;.5 0 .5 1"
                  repeatCount="indefinite"
                  begin="-.4s"
                />
              </circle>
              <circle fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="18" r="15" cx="100" cy="65">
                <animate
                  attributeName="cy"
                  calcMode="spline"
                  dur="2s"
                  values="65;135;65;"
                  keySplines=".5 0 .5 1;.5 0 .5 1"
                  repeatCount="indefinite"
                  begin="-.2s"
                />
              </circle>
              <circle fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="18" r="15" cx="160" cy="65">
                <animate
                  attributeName="cy"
                  calcMode="spline"
                  dur="2s"
                  values="65;135;65;"
                  keySplines=".5 0 .5 1;.5 0 .5 1"
                  repeatCount="indefinite"
                  begin="0s"
                />
              </circle>
            </svg>
          </div>
        )}
      </body>
    </html>
  );
}
