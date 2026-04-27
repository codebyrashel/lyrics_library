'use client';

import { getColors } from '@/store/colorStore';
import { PricingCard } from '@/components/ui/PricingCard';

export const PricingSection = () => {
  const colors = getColors();
  
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for casual watching',
      features: [
        'Up to 3 rooms',
        'YouTube streaming',
        'Basic chat',
        '7-day history',
        'Standard quality'
      ],
      buttonText: 'Get Started',
      isPopular: false
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'month',
      description: 'For serious streamers',
      features: [
        'Unlimited rooms',
        'YouTube + Local files',
        'Advanced chat + reactions',
        'Unlimited history',
        'HD quality',
        'Priority support',
        'No ads'
      ],
      buttonText: 'Go Pro',
      isPopular: true
    },
    {
      name: 'Family',
      price: '$24',
      period: 'month',
      description: 'Share with your family',
      features: [
        'Everything in Pro',
        'Up to 5 accounts',
        'Family rooms',
        'Shared playlists',
        'Admin controls',
        'Premium support'
      ],
      buttonText: 'Choose Family',
      isPopular: false
    }
  ];
  
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Simple,{' '}
            <span style={{ color: colors.primary }}>Transparent</span>{' '}
            Pricing
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.text.secondary }}
          >
            Choose the plan that works best for you
          </p>
        </div>
        
        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              buttonText={plan.buttonText}
              isPopular={plan.isPopular}
            />
          ))}
        </div>
        
        {/* Footer Note */}
        <div className="text-center mt-8">
          <p 
            className="text-sm"
            style={{ color: colors.text.muted }}
          >
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};