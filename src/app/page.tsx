import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { ReviewsSection } from '@/components/landing/ReviewsSection';
import { ComingSoonSection } from '@/components/landing/ComingSoonSection';
import { CTASection } from '@/components/landing/CTASection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <ReviewsSection />
      <ComingSoonSection />
      <CTASection />
    </main>
  );
}