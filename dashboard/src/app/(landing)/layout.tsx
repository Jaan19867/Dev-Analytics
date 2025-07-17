import '@/styles/globals.css';
import { Header } from './_components/header';
import { Footer } from './_components/footer';
import { cn } from '@/lib/utils';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('bg-black')}>
        <Header />
        {children}
        <div className="h-20"></div>
        <Footer />
      </body>
    </html>
  );
}
