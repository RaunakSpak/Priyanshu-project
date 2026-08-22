import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService } from '../services/authService';

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState(false);

    const new_password = watch('new_password');

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setApiError('');
        try {
            await authService.resetPassword({
                token: token,
                new_password: data.new_password
            });
            setSuccess(true);
        } catch (err: any) {
            let errorMessage = 'Failed to reset password. The link might be expired.';
            const detail = err.response?.data?.detail;
            if (typeof detail === 'string') {
                errorMessage = detail;
            } else if (Array.isArray(detail)) {
                errorMessage = detail[0]?.msg || errorMessage;
            }
            setApiError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center">
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-4">
                    Invalid or missing reset token.
                </div>
                <Link to="/login" className="text-[#00E5FF] hover:underline">Back to Login</Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center">
                <div className="flex justify-center mb-6 text-[#22C55E]">
                    <KeyRound size={48} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Password Reset Successful!</h2>
                <p className="text-gray-400 mb-6">Your password has been securely updated.</p>
                <Button onClick={() => navigate('/login')} className="flex items-center justify-center gap-2">
                    Proceed to Login <ArrowRight size={16} />
                </Button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-center mb-6 text-[#00E5FF]">
                <KeyRound size={48} />
            </div>
            <h2 className="text-2xl font-bold text-center mb-6">Create New Password</h2>
            
            {apiError && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="New Password"
                    type="password"
                    error={errors.new_password?.message as string}
                    {...register("new_password", { 
                        required: "Password is required",
                        minLength: { value: 8, message: "Min 8 characters" },
                        pattern: { 
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                            message: "Must include uppercase, lowercase, number, and special character"
                        }
                    })}
                />
                <Input
                    label="Confirm New Password"
                    type="password"
                    error={errors.confirmPassword?.message as string}
                    {...register("confirmPassword", { 
                        required: "Confirm Password is required",
                        validate: value => value === new_password || "Passwords do not match"
                    })}
                />
                
                <Button type="submit" isLoading={isLoading} className="mt-6">
                    Reset Password
                </Button>
            </form>
        </div>
    );
};
