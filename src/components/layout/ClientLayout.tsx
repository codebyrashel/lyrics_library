'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { getColors } from '@/store/colorStore';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const colors = getColors();
  
  // Hide navbar and footer on dashboard pages
  const isDashboard = pathname?.startsWith('/dashboard');
  
  return (
    <div style={{ backgroundColor: colors.background }}>
      {!isDashboard && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};