import { CodeIcon } from '@radix-ui/react-icons';

const githubUrl = 'https://github.com/shubhexists';
const twitterUrl = 'https://x.com/shubh_exists';

export const Footer = () => {
  return (
    <footer className="px-4 py-6">
      <div className="container flex items-center justify-center p-0 text-white">
        <CodeIcon className="mr-2 h-6 w-6" />
        <p className="text-sm">
          Built by{' '}
          <a className="underline underline-offset-4" href={twitterUrl}>
            shubhexists 
          </a>
          . See other interesting tools on{' '}
          <a className="underline underline-offset-4" href={githubUrl}>
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
};
