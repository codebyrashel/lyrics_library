'use client';

import { getColors } from '@/store/colorStore';
import { StepCard } from '@/components/ui/StepCard';

export const HowItWorksSection = () => {
  const colors = getColors();
  
  const steps = [
    {
      number: 1,
      title: 'Create Account',
      description: 'Sign up for free in seconds'
    },
    {
      number: 2,
      title: 'Choose a Plan',
      description: 'Select the plan that fits you'
    },
    {
      number: 3,
      title: 'Create or Join Room',
      description: 'Start a new room or join existing ones'
    },
    {
      number: 4,
      title: 'Invite Friends',
      description: 'Share the link and watch together'
    }
  ];
  
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.text.primary }}
          >
            How It{' '}
            <span style={{ color: colors.primary }}>Works</span>
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.text.secondary }}
          >
            Get started in just a few minutes
          </p>
        </div>
        
        {/* Steps Grid with Connectors */}
        <div className="relative flex flex-col md:flex-row gap-8 md:gap-4">
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};