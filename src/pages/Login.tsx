import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setApiError('');
        try {
            const res = await authService.login(data);
            login(res.access_token, res.user, data.remember_me);
            navigate('/');
        } catch (err: any) {
            setApiError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-center mb-6 text-[#00E5FF]">
                <LogIn size={48} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
            
            {apiError && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    icon={<Mail size={18} />}
                    error={errors.email?.message as string}
                    {...register("email", { 
                        required: "Email is required",
                        pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
                    })}
                />
                
                <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    icon={<Lock size={18} />}
                    rightElement={
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-white transition-colors">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                    error={errors.password?.message as string}
                    {...register("password", { required: "Password is required" })}
                />
                
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-600 bg-gray-700 text-[#00E5FF] focus:ring-[#00E5FF]" {...register("remember_me")} />
                        <span className="text-gray-300">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-[#00E5FF] hover:underline">Forgot Password?</Link>
                </div>

                <Button type="submit" isLoading={isLoading} className="mt-6">
                    Sign In
                </Button>
            </form>
            
            <p className="mt-6 text-center text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#22C55E] hover:underline font-medium">
                    Register here
                </Link>
            </p>
        </div>
    );
};
