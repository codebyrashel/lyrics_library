'use client';

import { Play, Upload, Users, MessageCircle, Smartphone, Sparkles } from 'lucide-react';
import { getColors } from '@/store/colorStore';

const features = [
  {
    icon: Play,
    title: 'YouTube Support',
    description: 'Watch any YouTube video in perfect sync with friends.',
    color: '#FF0000',
  },
  {
    icon: Upload,
    title: 'Local Files',
    description: 'Upload and share your own videos and music.',
    color: '#10B981',
  },
  {
    icon: Users,
    title: 'Up to 3 Viewers',
    description: 'Start with 3 viewers free. Create account for more.',
    color: '#3B82F6',
  },
  {
    icon: MessageCircle,
    title: 'Real-time Chat',
    description: 'Chat with friends while watching together.',
    color: '#8B5CF6',
  },
  {
    icon: Smartphone,
    title: 'Works on Any Device',
    description: 'Phone, tablet, or computer - join from anywhere.',
    color: '#F59E0B',
  },
  {
    icon: Sparkles,
    title: 'No Account Needed',
    description: 'Start watching instantly. No signup required.',
    color: '#EF4444',
  },
];

export const FeaturesSection = () => {
  const colors = getColors();

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: `${colors.primary}10` }}
          >
            <Sparkles size={14} style={{ color: colors.primary }} />
            <span className="text-sm font-medium" style={{ color: colors.primary }}>
              Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>
            Everything you need to{' '}
            <span style={{ color: colors.primary }}>watch together</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.muted }}>
            Powerful features that make watching with friends seamless and fun
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-xl transition-colors cursor-pointer group"
                style={{ 
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.surface}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.text.muted}5`;
                  e.currentTarget.style.borderColor = `${feature.color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background;
                  e.currentTarget.style.borderColor = colors.surface;
                }}
              >
                <div 
                  className="inline-flex p-3 rounded-lg mb-4 transition-colors"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.text.primary }}>
                  {feature.title}
                </h3>
                <p style={{ color: colors.text.secondary }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};