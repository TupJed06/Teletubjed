import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NavBar } from '../components/organisms/NavBar';
import { TimerProvider } from '../context/TimerContext';
import { RouterProvider } from '../context/RouterContext'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Teletubjed',
  description: 'Focus Timer App',
  icons:{
    icon: '/img/icon.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TimerProvider>
          <RouterProvider>
            {/* NavBar is here, so it stays on screen forever */}
            <NavBar />
            
            <main className="pt-20 min-h-screen bg-gray-50">
              {/* MAGIC HAPPENS HERE: 
                 Next.js automatically replaces {children} with:
                 - src/app/page.tsx (when at /)
                 - src/app/history/page.tsx (when at /history)
              */}
              {children}
            </main>
          </RouterProvider>
        </TimerProvider>
      </body>
    </html>
  );
}