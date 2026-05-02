'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { AuthCard } from '@/components/ui/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const colors = getColors();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await login(formData.email, formData.password);
    if (success) {
      router.push('/dashboard');
    }
  };
  
  return (
    <AuthCard 
      title="Welcome Back" 
      subtitle="Sign in to your account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div 
            className="p-3 rounded-lg text-sm text-center"
            style={{ backgroundColor: `${colors.status.error}15`, color: colors.status.error }}
          >
            {error}
          </div>
        )}
        
        {/* Email Input */}
        <Input
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={<Mail size={18} style={{ color: colors.text.muted }} />}
          required
        />
        
        {/* Password Input with Show/Hide */}
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            icon={<Lock size={18} style={{ color: colors.text.muted }} />}
            required
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
        <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
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