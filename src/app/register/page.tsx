'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { getColors } from '@/store/colorStore';
import { AuthCard } from '@/components/ui/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const colors = getColors();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    const success = await register(
      formData.name,
      formData.username,
      formData.email,
      formData.password,
      formData.confirmPassword
    );
    
    if (success) {
      router.push('/dashboard');
    }
  };
  
  return (
    <AuthCard 
      title="Create Account" 
      subtitle="Get started with your free account"
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
        
        {/* Name Input */}
        <Input
          type="text"
          placeholder="Full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          icon={<User size={18} style={{ color: colors.text.muted }} />}
          required
        />
        
        {/* Username Input */}
        <Input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
          icon={<User size={18} style={{ color: colors.text.muted }} />}
          required
        />
        
        {/* Email Input */}
        <Input
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={<Mail size={18} style={{ color: colors.text.muted }} />}
          required
        />
        
        {/* Password Input */}
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
        
        {/* Confirm Password Input */}
        <div className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            icon={<Lock size={18} style={{ color: colors.text.muted }} />}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            style={{ color: colors.text.muted }}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        
        {/* Submit Button */}
        <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
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