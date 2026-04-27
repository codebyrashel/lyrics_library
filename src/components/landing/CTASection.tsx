'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';

export const CTASection = () => {
  const colors = getColors();
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div 
          className="p-12 rounded-2xl relative overflow-hidden"
          style={{ 
            backgroundColor: `${colors.primary}05`,
            border: `2px solid ${colors.primary}20`
          }}
        >
          {/* Decorative elements */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${colors.primary}10` }}
          />
          <div 
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${colors.accent}10` }}
          />
          
          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Icon */}
            <div 
              className="inline-flex p-3 rounded-full mb-6"
              style={{ backgroundColor: `${colors.primary}15` }}
            >
              <Sparkles size={32} style={{ color: colors.primary }} />
            </div>
            
            {/* Main Heading */}
            <h2 
              className="text-3xl md:text-5xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Ready to start{' '}
              <span style={{ color: colors.primary }}>watching together?</span>
            </h2>
            
            {/* Description */}
            <p 
              className="text-lg max-w-2xl mx-auto mb-8"
              style={{ color: colors.text.secondary }}
            >
              Join thousands of users who are already enjoying synchronized viewing with friends
            </p>
            
            {/* CTA Buttons Group */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary">
                Create Free Account
                <ArrowRight size={18} className="ml-2 inline" />
              </Button>
              <Button variant="outline">
                See Pricing
              </Button>
            </div>
            
            {/* Trust Text */}
            <p 
              className="text-xs mt-6"
              style={{ color: colors.text.muted }}
            >
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};