'use client';

import { getColors } from '@/store/colorStore';
import { 
  SiDiscord, 
  SiSpotify,
  SiGoogleanalytics,
  SiWebrtc,
  SiNetflix,
  SiPrime,
  SiDisneyplus
} from 'react-icons/si';
import { Clock, Tv, Users, Share2, Film } from 'lucide-react';

export const ComingSoonSection = () => {
  const colors = getColors();
  
  const features = [
    {
      icon: SiWebrtc,
      title: 'Local File Streaming (WebRTC)',
      description: 'Watch local videos and audio files with friends using peer-to-peer streaming. No upload required.',
      iconColor: '#25A162',
      status: 'In Development'
    },
    {
      icon: SiDiscord,
      title: 'Discord Rich Presence',
      description: 'Show what you are watching directly on your Discord profile. Friends can join with one click.',
      iconColor: '#5865F2',
      status: 'Planning'
    },
    {
      icon: SiSpotify,
      title: 'Spotify Integration',
      description: 'Sync Spotify playback across your room. Listen to music together in perfect harmony.',
      iconColor: '#1DB954',
      status: 'Planning'
    },
    {
      icon: SiNetflix,
      title: 'Netflix Party Mode',
      description: 'Watch Netflix shows and movies together with synchronized playback and chat.',
      iconColor: '#E50914',
      status: 'Research'
    },
    {
      icon: SiGoogleanalytics,
      title: 'Watch Analytics',
      description: 'Track your viewing habits, most watched content, and time spent with friends.',
      iconColor: '#F4B400',
      status: 'Planning'
    },
    {
      icon: Share2,
      title: 'Social Sharing',
      description: 'Share your watch parties on social media. Create public rooms for community watching.',
      iconColor: '#3B82F6',
      status: 'Planning'
    },
    {
      icon: Users,
      title: 'Voice Chat',
      description: 'Talk with friends while watching using built-in voice channels.',
      iconColor: '#8B5CF6',
      status: 'Future'
    },
    {
      icon: Film,
      title: 'Watch History Sync',
      description: 'Sync your watch history across devices. Never lose track of what you watched.',
      iconColor: '#EF4444',
      status: 'Future'
    },
    {
      icon: Tv,
      title: 'Smart TV Support',
      description: 'Cast your watch party to your TV. Mobile app for easy control.',
      iconColor: '#F59E0B',
      status: 'Future'
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
        
        {/* Coming Soon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const getStatusColor = () => {
              switch (feature.status) {
                case 'In Development': return colors.status.success;
                case 'Planning': return colors.status.warning;
                case 'Research': return colors.status.info;
                default: return colors.text.muted;
              }
            };
            
            return (
              <div 
                key={index}
                className="relative p-6 rounded-xl transition-colors group"
                style={{ 
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.surface}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.text.muted}5`;
                  e.currentTarget.style.borderColor = `${feature.iconColor}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.surface;
                  e.currentTarget.style.borderColor = colors.surface;
                }}
              >
                {/* Status Badge */}
                <div 
                  className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold"
                  style={{ 
                    backgroundColor: `${getStatusColor()}15`,
                    color: getStatusColor()
                  }}
                >
                  {feature.status}
                </div>
                
                {/* Icon */}
                <div 
                  className="inline-flex p-3 rounded-lg mb-4"
                  style={{ backgroundColor: `${feature.iconColor}15` }}
                >
                  <Icon size={28} style={{ color: feature.iconColor }} />
                </div>
                
                {/* Title */}
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: colors.text.primary }}
                >
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm" style={{ color: colors.text.secondary }}>
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