import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService } from '../services/authService';

export const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [apiError, setApiError] = useState('');

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setApiError('');
        setStatusMessage('');
        try {
            const res = await authService.forgotPassword(data.email);
            setStatusMessage(res.message);
        } catch (err: any) {
            setApiError(err.response?.data?.detail || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-center mb-6 text-[#00E5FF]">
                <Mail size={48} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
            <p className="text-gray-400 text-center text-sm mb-6">
                Enter your email and we'll send you a link to reset your password.
            </p>
            
            {statusMessage && (
                <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-lg mb-4 text-sm text-center">
                    {statusMessage}
                </div>
            )}
            
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
                    error={errors.email?.message as string}
                    {...register("email", { 
                        required: "Email is required",
                        pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" }
                    })}
                />
                
                <Button type="submit" isLoading={isLoading} className="mt-6">
                    Send Reset Link
                </Button>
            </form>
            
            <Link to="/login" className="mt-6 flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                <ArrowLeft size={16} /> Back to Login
            </Link>
        </div>
    );
};
