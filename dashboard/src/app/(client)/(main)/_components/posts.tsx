'use client';
import { CheckIcon, FilePlusIcon, NewTab, TrashIcon } from '@/components/icons';
import { LoadingButton } from '@/components/loading-button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/store/userId.context';
import { useWebsites } from '@/store/website.context';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ClipboardCopyIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

export function Posts() {
  const { websites } = useWebsites();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <NewPost />
      {websites.map((site) => (
        <PostCard
          createdAt={site.createdAt}
          url={site.website}
          description={site.description}
          key={site.website}
          id={site.id}
        />
      ))}
    </div>
  );
}

function NewPost() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const userId = useUser();
  const { websites, setWebsites } = useWebsites();
  const { toast } = useToast();
  const addWebsite = async () => {
    try {
      setIsLoading(true);
      const id = window.crypto.randomUUID();
      const response = await fetch('http://localhost:3001/api/dashboard/addWebsite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId?.user.userId, website: url, description, id }),
      });

      if (!response.ok) {
        throw new Error('Failed to add website');
      }

      setWebsites((prevWebsites) => [...prevWebsites, { website: url, description, createdAt: new Date(), id }]);
      setUrl('');
      setDescription('');
      setOpen(false);
    } catch (error) {
      console.error('Error adding website:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !userId?.user.isPremium) {
      if (userId?.user.isFreeTrial) {
        if (websites.length >= 1) {
          toast({
            description: 'Free trial is limited to 1 website only. Upgrade for more',
            variant: 'destructive',
          });
          return;
        } else {
          setOpen(isOpen);
          return;
        }
      }
      toast({
        description: 'You need to upgrade to a premium plan to add more websites.',
        variant: 'destructive',
      });
      return;
    } else {
      if (userId?.user.premiumType === 'Starter') {
        if (websites.length >= 3) {
          toast({
            description: 'Starter Plan is limited to 3 website only. Upgrade for more',
            variant: 'destructive',
          });
          return;
        }
      }
      setOpen(isOpen);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger className="px-2 py-1.5 text-sm text-muted-foreground outline-none" asChild>
        <Button className="flex h-full cursor-pointer items-center justify-center bg-card p-6 text-muted-foreground transition-colors hover:bg-secondary/10 dark:border-none dark:bg-secondary/30 dark:hover:bg-secondary/50">
          <div className="flex flex-col items-center gap-4">
            <FilePlusIcon className="h-10 w-10" />
            <p className="text-sm">New Post</p>
          </div>
        </Button>
      </AlertDialogTrigger>
      {userId?.user.isPremium ? (
        <AlertDialogContent className="max-w-xs">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center"> ADD A WEBSITE </AlertDialogTitle>
            <AlertDialogDescription>
              URL: <Input className="mt-1" value={url} onChange={(e) => setUrl(e.target.value)}></Input> <br></br>
              Description:
              <Input className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)}></Input>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <LoadingButton loading={isLoading} onClick={() => addWebsite()}>
              Submit
            </LoadingButton>
          </div>
        </AlertDialogContent>
      ) : userId?.user.isFreeTrial ? (
        websites.length >= 1 ? null : (
          <AlertDialogContent className="max-w-xs">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center"> ADD A WEBSITE </AlertDialogTitle>
              <AlertDialogDescription>
                URL: <Input className="mt-1" value={url} onChange={(e) => setUrl(e.target.value)}></Input> <br></br>
                Description:
                <Input className="mt-1" value={description} onChange={(e) => setDescription(e.target.value)}></Input>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <LoadingButton loading={isLoading} onClick={() => addWebsite()}>
                Submit
              </LoadingButton>
            </div>
          </AlertDialogContent>
        )
      ) : null}
    </AlertDialog>
  );
}

interface PostCardProps {
  id: string;
  url: string;
  description: string;
  createdAt: Date;
}

function PostCard({ createdAt, description, url, id }: PostCardProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [confirm, setConfirm] = useState('');
  const userId = useUser();
  const [copied, setCopied] = useState(false);
  const { websites, setWebsites } = useWebsites();

  const confirmChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setConfirm(value);
    setDisabled(value !== 'CONFIRM');
  };

  const removeWebsite = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/dashboard/removeWebsite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId?.user.userId, id }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove website');
      }

      const updatedWebsites = websites.filter((website) => website.id !== id);
      setWebsites(updatedWebsites);

      setOpen(false);
    } catch (error) {
      console.error('Error removing website:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2 text-base">
          <div>
            <Link href={`/${id}`} className="hover:underline inline-flex items-center">
              {url} <NewTab className="ml-1" />
            </Link>
          </div>
        </CardTitle>
        <CardDescription className="line-clamp-1 text-sm">
          {new Date(createdAt).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="line-clamp-3 text-sm">{description}</CardContent>
      <CardFooter className="flex-row-reverse gap-2">
        <CopyToClipboard text={id}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="secondary" size="icon" className="h-8 w-8" onClick={handleCopy}>
                  {copied ? <CheckIcon className="h-4 w-4" /> : <ClipboardCopyIcon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? 'Copied!' : 'Copy ProjectID'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CopyToClipboard>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger className="px-2 py-1.5 text-sm text-muted-foreground outline-none" asChild>
            <Button variant="secondary" size="icon" className="h-8 w-8 text-destructive">
              <TrashIcon className="h-6 w-6" />
              <span className="sr-only">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-xs">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">Remove {url}?</AlertDialogTitle>
              <AlertDialogDescription>
                You can add this website again, although you will lose the current data. Type &apos;CONFIRM&apos; to
                remove the website.
                <Input className="mt-2" value={confirm} onChange={confirmChange} />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <LoadingButton loading={isLoading} disabled={disabled} onClick={() => removeWebsite()}>
                Remove
              </LoadingButton>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        <Badge variant="outline" className="mr-auto rounded-lg capitalize">
          {userId?.user.isPremium ? 'Pro' : 'Free'}
        </Badge>
      </CardFooter>
    </Card>
  );
}
