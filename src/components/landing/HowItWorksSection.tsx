'use client';

import { Plus, Share2, Tv, Sparkles } from 'lucide-react';
import { getColors } from '@/store/colorStore';

const steps = [
  {
    icon: Plus,
    title: 'Create a Room',
    description: 'Click create room and get your unique room link instantly. No signup needed.',
    color: '#3B82F6',
  },
  {
    icon: Share2,
    title: 'Share the Link',
    description: 'Send the room link to friends. They can join from any device, no account required.',
    color: '#8B5CF6',
  },
  {
    icon: Tv,
    title: 'Watch Together',
    description: 'Sync YouTube videos, share local files, and chat in real-time with perfect sync.',
    color: '#10B981',
  },
];

export const HowItWorksSection = () => {
  const colors = getColors();

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: `${colors.primary}10` }}
          >
            <Sparkles size={14} style={{ color: colors.primary }} />
            <span className="text-sm font-medium" style={{ color: colors.primary }}>
              Simple Process
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            How it{' '}
            <span style={{ color: colors.primary }}>Works</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.muted }}>
            Three simple steps to start watching together with friends
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl transition-colors"
                style={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.text.muted}15`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.text.muted}5`;
                  e.currentTarget.style.borderColor = `${step.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surface;
                  e.currentTarget.style.borderColor = `${colors.text.muted}15`;
                }}
              >
                {/* Icon */}
                <div
                  className="inline-flex p-3 rounded-lg mb-4"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <Icon size={24} style={{ color: step.color }} />
                </div>

                {/* Step Number */}
                <div className="text-sm font-semibold mb-2" style={{ color: step.color }}>
                  Step {index + 1}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed" style={{ color: colors.text.secondary }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <p className="text-xs text-center mt-8" style={{ color: colors.text.muted }}>
          No credit card required • Free forever
        </p>
      </div>
    </section>
  );
};