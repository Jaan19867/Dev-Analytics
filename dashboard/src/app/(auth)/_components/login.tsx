'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitHubLogoIcon } from '@/components/icons';
import { APP_TITLE, CLIENT_ID } from '@/lib/constants';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export function Login() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('githubAccessToken');
    if (accessToken) {
      router.push('/dashboard');
    }
    if (code) {
      // here backend url 
      fetch(`http://localhost:3001/api/getAccessToken?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          const accessToken = data.token;
          localStorage.setItem('githubAccessToken', accessToken);
          router.push('/dashboard');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [code, router]);

  if (code) {
    return (
      <div className="flex items-center justify-center w-full max-w-md">
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
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>{APP_TITLE} Log In</CardTitle>
        <CardDescription>Log in to your account to access your dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`}>
            <GitHubLogoIcon className="mr-2 h-5 w-5" />
            Log in with Github
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
