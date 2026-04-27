'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { AuthCard } from '@/components/ui/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const colors = getColors();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic later
    console.log('Register attempt:', formData);
  };
  
  return (
    <AuthCard 
      title="Create Account" 
      subtitle="Get started with your free account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <Input
          type="text"
          placeholder="Full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          icon={<User size={18} style={{ color: colors.text.muted }} />}
        />
        
        {/* Email Input */}
        <Input
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={<Mail size={18} style={{ color: colors.text.muted }} />}
        />
        
        {/* Password Input */}
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            icon={<Lock size={18} style={{ color: colors.text.muted }} />}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            style={{ color: colors.text.muted }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        
        {/* Confirm Password Input */}
        <Input
          type="password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          icon={<Lock size={18} style={{ color: colors.text.muted }} />}
        />
        
        {/* Submit Button */}
        <Button variant="primary" className="w-full">
          Create Account
        </Button>
        
        {/* Sign In Link */}
        <p className="text-center text-sm" style={{ color: colors.text.secondary }}>
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="font-semibold hover:underline"
            style={{ color: colors.primary }}
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}