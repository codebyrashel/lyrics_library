'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { AuthCard } from '@/components/ui/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const colors = getColors();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic later
    console.log('Login attempt:', formData);
  };
  
  return (
    <AuthCard 
      title="Welcome Back" 
      subtitle="Sign in to your account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <Input
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={<Mail size={18} style={{ color: colors.text.muted }} />}
        />
        
        {/* Password Input with Show/Hide */}
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
        
        {/* Forgot Password Link */}
        <div className="text-right">
          <Link 
            href="/forgot-password" 
            className="text-sm hover:underline"
            style={{ color: colors.primary }}
          >
            Forgot password?
          </Link>
        </div>
        
        {/* Submit Button */}
        <Button variant="primary" className="w-full">
          Sign In
        </Button>
        
        {/* Register Link */}
        <p className="text-center text-sm" style={{ color: colors.text.secondary }}>
          Don&apos;t have an account?{' '}
          <Link 
            href="/register" 
            className="font-semibold hover:underline"
            style={{ color: colors.primary }}
          >
            Create account
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}