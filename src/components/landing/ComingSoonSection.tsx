'use client';

import { getColors } from '@/store/colorStore';
import { 
  SiDiscord, 
  SiSpotify,
  SiGoogleanalytics
} from 'react-icons/si';
import { Clock } from 'lucide-react';

export const ComingSoonSection = () => {
  const colors = getColors();
  
  const features = [
    {
      icon: SiDiscord,
      title: 'Discord Integration',
      description: 'Show what you are watching on Discord with Rich Presence',
      iconColor: '#5865F2'
    },
    {
      icon: SiSpotify,
      title: 'Spotify Support',
      description: 'Stream Spotify music directly in your rooms',
      iconColor: '#1DB954'
    },
    {
      icon: SiGoogleanalytics,
      title: 'Advanced Analytics',
      description: 'Detailed listening statistics and insights',
      iconColor: '#F4B400'
    }
  ];
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ backgroundColor: `${colors.primary}10` }}
          >
            <Clock size={16} style={{ color: colors.primary }} />
            <span 
              className="text-sm font-semibold"
              style={{ color: colors.primary }}
            >
              Coming Soon
            </span>
          </div>
          
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            We are building{' '}
            <span style={{ color: colors.primary }}>even more</span>
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.text.secondary }}
          >
            Features we are working on to make your experience better
          </p>
        </div>
        
        {/* Coming Soon Cards Grid - Wider cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="relative p-8 rounded-lg transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.surface}`,
                }}
              >
                {/* Coming Soon Badge - Top Right Corner */}
                <div 
                  className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold"
                  style={{ 
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary
                  }}
                >
                  Coming Soon
                </div>
                
                {/* Icon */}
                <div 
                  className="inline-flex p-4 rounded-full mb-4"
                  style={{ backgroundColor: `${feature.iconColor}15` }}
                >
                  <Icon size={40} style={{ color: feature.iconColor }} />
                </div>
                
                {/* Title */}
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {feature.title}
                </h3>
                
                {/* Description */}
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