'use client';

import { getColors } from '@/store/colorStore';
import { Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const PricingSection = () => {
  const colors = getColors();
  
  const plans = [
    {
      name: 'Guest',
      price: '$0',
      period: 'forever',
      description: 'Try before you sign up',
      features: [
        { name: 'Create rooms', included: true },
        { name: 'Join rooms', included: true },
        { name: 'Max viewers per room', value: '3', included: true },
        { name: 'Video quality', value: '720p', included: true },
        { name: 'YouTube streaming', included: true },
        { name: 'Local file streaming (WebRTC)', included: false, comingSoon: true },
        { name: 'Chat access', included: false, comingSoon: true },
        { name: 'Save rooms', included: false },
        { name: 'Room history', included: false },
      ],
      buttonText: 'Try Now',
      buttonVariant: 'outline' as const,
      isPopular: false,
      note: 'No account required'
    },
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'For casual viewers',
      features: [
        { name: 'Create rooms', included: true },
        { name: 'Join rooms', included: true },
        { name: 'Max viewers per room', value: '5', included: true },
        { name: 'Video quality', value: '1080p', included: true },
        { name: 'YouTube streaming', included: true },
        { name: 'Local file streaming (WebRTC)', value: '100MB', included: true },
        { name: 'Chat access', included: true },
        { name: 'Save rooms', value: '10 rooms', included: true },
        { name: 'Room history', value: '30 days', included: true },
      ],
      buttonText: 'Sign Up Free',
      buttonVariant: 'outline' as const,
      isPopular: false,
      note: 'Free forever'
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'month',
      description: 'For serious streamers',
      features: [
        { name: 'Create rooms', included: true },
        { name: 'Join rooms', included: true },
        { name: 'Max viewers per room', value: 'Unlimited', included: true },
        { name: 'Video quality', value: '4K', included: true },
        { name: 'YouTube streaming', included: true },
        { name: 'Local file streaming (WebRTC)', value: '1GB', included: true },
        { name: 'Chat access', included: true },
        { name: 'Save rooms', value: 'Unlimited', included: true },
        { name: 'Room history', value: 'Forever', included: true },
        { name: 'No ads', included: true },
        { name: 'Priority support', included: true },
        { name: 'Custom emojis', included: true },
        { name: 'Screen sharing', included: true },
      ],
      buttonText: 'Go Pro',
      buttonVariant: 'primary' as const,
      isPopular: true,
      note: 'Billed monthly'
    },
    {
      name: 'Family',
      price: '$24',
      period: 'month',
      description: 'Share with your family',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Up to 5 accounts', value: '5 accounts', included: true },
        { name: 'Family rooms', included: true },
        { name: 'Shared playlists', included: true },
        { name: 'Admin controls', included: true },
        { name: 'Premium support', included: true },
        { name: 'Local file streaming', value: '5GB per file', included: true },
        { name: 'Yearly subscription', value: '$240/year', included: true },
      ],
      buttonText: 'Choose Family',
      buttonVariant: 'outline' as const,
      isPopular: false,
      note: 'Save $48/year'
    }
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: `${colors.primary}10` }}
          >
            <Sparkles size={14} style={{ color: colors.primary }} />
            <span className="text-sm font-medium" style={{ color: colors.primary }}>
              Pricing
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Choose the plan that&apos;s right for{' '}
            <span style={{ color: colors.primary }}>you</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.muted }}>
            Start free, upgrade when you need more. All plans include a 14-day trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-6 transition-all hover:-translate-y-1 ${
                plan.isPopular ? 'shadow-xl' : ''
              }`}
              style={{ 
                backgroundColor: colors.surface,
                border: `2px solid ${plan.isPopular ? colors.primary : colors.surface}`,
              }}
            >
              {plan.isPopular && (
                <div 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: colors.primary, color: 'white' }}
                >
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
                {plan.name}
              </h3>
              
              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold" style={{ color: colors.primary }}>
                  {plan.price}
                </span>
                {plan.price !== '$0' && (
                  <span className="text-sm" style={{ color: colors.text.muted }}>/{plan.period}</span>
                )}
              </div>
              
              {/* Description */}
              <p className="text-sm mb-4" style={{ color: colors.text.muted }}>
                {plan.description}
              </p>
              
              {/* Features */}
              <div className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check size={14} style={{ color: colors.primary }} />
                    ) : (
                      <X size={14} style={{ color: colors.text.muted }} />
                    )}
                    <span style={{ color: feature.included ? colors.text.primary : colors.text.muted }}>
                      {feature.name}
                      {feature.value && (
                        <span className="text-xs ml-1" style={{ color: colors.primary }}>
                          ({feature.value})
                        </span>
                      )}
                      {feature.comingSoon && (
                        <span className="text-xs ml-1" style={{ color: colors.status.warning }}>
                          (Coming soon)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Button */}
              <Button 
                variant={plan.buttonVariant} 
                className="w-full"
              >
                {plan.buttonText}
              </Button>
              
              {/* Note */}
              <p className="text-xs text-center mt-3" style={{ color: colors.text.muted }}>
                {plan.note}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 pt-8 border-t" style={{ borderColor: `${colors.text.muted}20` }}>
          <p className="text-sm" style={{ color: colors.text.muted }}>
            All paid plans include a 14-day free trial. No credit card required to start.
          </p>
          <p className="text-xs mt-2" style={{ color: colors.text.muted }}>
            Local file streaming uses WebRTC technology for peer-to-peer sharing
          </p>
        </div>
      </div>
    </section>
  );
};