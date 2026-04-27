'use client';

import { ReactNode } from 'react';
import { getColors } from '@/store/colorStore';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const colors = getColors();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main 
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          style={{ backgroundColor: colors.background }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};