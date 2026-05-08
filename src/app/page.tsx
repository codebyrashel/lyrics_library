'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CallToAction } from '@/components/landing/CallToAction';
import { useAuth } from '@/contexts/AuthContext';
import { PricingSection } from '@/components/landing/PricingSection';
import { ReviewsSection } from '@/components/landing/ReviewsSection';
import { ComingSoonSection } from '@/components/landing/ComingSoonSection';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection/>
      <ReviewsSection/>
      <ComingSoonSection/>
      <CallToAction />
    </main>
  );
}