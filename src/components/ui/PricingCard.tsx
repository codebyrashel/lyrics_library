'use client';

import { Check } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { Button } from './Button';

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

export const PricingCard = ({ 
  name, 
  price, 
  period, 
  description, 
  features, 
  buttonText, 
  isPopular = false 
}: PricingCardProps) => {
  const colors = getColors();
  
  return (
    <div 
      className={`relative rounded-lg p-6 transition-all duration-300 hover:scale-105 ${
        isPopular ? 'shadow-lg' : ''
      }`}
      style={{ 
        backgroundColor: colors.surface,
        border: `2px solid ${isPopular ? colors.primary : colors.surface}`
      }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div 
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ 
            backgroundColor: colors.primary,
            color: 'white'
          }}
        >
          Most Popular
        </div>
      )}
      
      {/* Plan Name */}
      <h3 
        className="text-xl font-bold mb-2"
        style={{ color: colors.text.primary }}
      >
        {name}
      </h3>
      
      {/* Price */}
      <div className="mb-4">
        <span 
          className="text-4xl font-bold"
          style={{ color: colors.primary }}
        >
          {price}
        </span>
        <span style={{ color: colors.text.secondary }}>/{period}</span>
      </div>
      
      {/* Description */}
      <p 
        className="text-sm mb-4"
        style={{ color: colors.text.secondary }}
      >
        {description}
      </p>
      
      {/* Features List */}
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <Check size={16} style={{ color: colors.primary }} />
            <span style={{ color: colors.text.secondary }}>{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* Button */}
      <Button variant={isPopular ? 'primary' : 'outline'} className="w-full">
        {buttonText}
      </Button>
    </div>
  );
};