'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { getColors } from '@/store/colorStore';

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const colors = getColors();
  
  // Hide navbar and footer on dashboard and room pages
  const isDashboard = pathname?.startsWith('/dashboard');
  const isRoom = pathname?.startsWith('/room');
  const hideNavFooter = isDashboard || isRoom;
  
  return (
    <div style={{ backgroundColor: colors.background }}>
      {!hideNavFooter && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!hideNavFooter && <Footer />}
    </div>
  );
};