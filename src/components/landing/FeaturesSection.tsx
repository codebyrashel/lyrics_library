'use client';

import { getColors } from '@/store/colorStore';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { 
  FiUsers, 
//   FiVideo, 
  FiMessageCircle, 
  FiClock, 
  FiLock
} from 'react-icons/fi';
import { 
  SiYoutube, 
//   SiGooglechrome 
} from 'react-icons/si';
import { FaDiscord } from 'react-icons/fa';

export const FeaturesSection = () => {
  const colors = getColors();
  
  const features = [
    {
      icon: FiUsers,
      title: 'Private Rooms',
      description: 'Create invite-only rooms for you and your friends. Watch together in perfect privacy.',
      iconColor: '#3B82F6'
    },
    {
      icon: SiYoutube,
      title: 'Multi-Source Support',
      description: 'Sync YouTube videos, online media, or upload your own local files to watch together.',
      iconColor: '#FF0000'
    },
    {
      icon: FiMessageCircle,
      title: 'Real-time Chat',
      description: 'Chat with friends while watching. React to moments together with emoji reactions.',
      iconColor: '#10B981'
    },
    {
      icon: FiClock,
      title: 'Smart History',
      description: 'Track everything you watch, even if videos get removed.',
      iconColor: '#8B5CF6'
    },
    {
      icon: FiLock,
      title: 'Private & Secure',
      description: 'Your rooms are private. Only people with the link can join.',
      iconColor: '#EF4444'
    },
    {
      icon: FaDiscord,
      title: 'Discord Rich Presence',
      description: 'Show what you are watching on Discord (Coming Soon)',
      iconColor: '#5865F2'
    }
  ];
  
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            Everything you need to watch{' '}
            <span style={{ color: colors.primary }}>together</span>
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.text.secondary }}
          >
            Powerful features that make watching with friends seamless and fun
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconColor={feature.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};