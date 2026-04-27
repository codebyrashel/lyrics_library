'use client';

import { ArrowRight, LogIn } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from '@/components/ui/Button';

export const HeroSection = () => {
  const colors = getColors();
  
  const stats = [
    { value: 'Free', label: 'Rooms' },
    { value: '4K', label: 'HD Quality' },
    { value: 'Real-time', label: 'Sync' },
    { value: '100%', label: 'Privacy' },
  ];
  
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          {/* Main Heading */}
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ color: colors.text.primary }}
          >
            Watch Together,
            <br />
            <span style={{ color: colors.primary }}>Anywhere, Anytime</span>
          </h1>
          
          {/* Description */}
          <p 
            className="text-lg md:text-xl max-w-3xl mx-auto mb-10"
            style={{ color: colors.text.secondary }}
          >
            Create private rooms, sync Youtube videos or online sourced videos/audio and local media 
            with friends, chat in real-time, and never lose track of what you watched.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary">
              Get Started Free
              <ArrowRight size={18} className="ml-2 inline" />
            </Button>
            <Button variant="outline">
              Sign In
              <LogIn size={18} className="ml-2 inline" />
            </Button>
          </div>
        </div>
        
        {/* Stats Section - Clean and uniform */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center transition-all duration-200 hover:scale-105"
            >
              <div 
                className="text-3xl font-bold mb-1"
                style={{ color: colors.primary }}
              >
                {stat.value}
              </div>
              <div 
                className="font-semibold text-lg"
                style={{ color: colors.text.primary }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};