import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Phone, Calendar, Type, Scale, Target, BarChart2, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Input } from '../components/Input';
import { authService } from '../services/authService';

export const Register = () => {
    const { register, handleSubmit, watch, formState: { errors }, clearErrors } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const password = watch('password');

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setApiError('');
        try {
            // Remove confirmPassword before sending to API
            const { confirmPassword, height_ft, height_in, height_cm, ...registerData } = data;
            // Parse ints
            registerData.age = parseInt(registerData.age);
            
            // Handle height conversion
            if (heightUnit === 'ft') {
                const ft = parseInt(height_ft || 0);
                const inc = parseInt(height_in || 0);
                registerData.height = Math.round((ft * 30.48) + (inc * 2.54));
            } else {
                registerData.height = parseInt(height_cm || 0);
            }
            
            registerData.weight = parseInt(registerData.weight);
            
            await authService.register(registerData);
            navigate('/login');
        } catch (err: any) {
            setApiError(err.response?.data?.detail || 'Registration failed. Please check your inputs.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-10 px-4 flex items-center justify-center">
            <div className="w-full max-w-3xl bg-[#161B22] border border-gray-800 shadow-[0_0_50px_rgba(34,197,94,0.05)] rounded-2xl p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#22C55E]/10 blur-[80px] rounded-full pointer-events-none"></div>

                <div className="flex justify-center mb-4 relative">
                    <div className="p-4 rounded-full bg-[#1C2331] text-[#22C55E] shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-1 ring-[#22C55E]/20">
                        <UserPlus size={40} />
                    </div>
                </div>
                
                <h2 className="text-3xl font-bold text-center mb-2 text-white tracking-wide">
                    Create <span className="text-[#22C55E]">Your</span> Account
                </h2>
                <p className="text-gray-400 text-center mb-8 text-sm">Start your fitness journey with us</p>
                
                {apiError && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                            label="First Name"
                            placeholder="Enter first name"
                            icon={<User size={18} />}
                            error={errors.first_name?.message as string}
                            {...register("first_name", { required: "First name is required" })}
                        />
                        <Input
                            label="Last Name"
                            placeholder="Enter last name"
                            icon={<User size={18} />}
                            error={errors.last_name?.message as string}
                            {...register("last_name", { required: "Last name is required" })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email"
                            icon={<Mail size={18} />}
                            error={errors.email?.message as string}
                            {...register("email", { 
                                required: "Email is required",
                                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
                            })}
                        />
                        <Input
                            label="Phone Number"
                            type="tel"
                            maxLength={10}
                            placeholder="Enter phone number"
                            icon={<Phone size={18} />}
                            error={errors.phone?.message as string}
                            {...register("phone", { 
                                required: "Phone is required",
                                pattern: { value: /^[0-9]{10}$/, message: "Must be exactly 10 digits" },
                                onChange: (e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                }
                            })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Input
                            label="Age"
                            type="number"
                            placeholder="18"
                            icon={<Calendar size={18} />}
                            error={errors.age?.message as string}
                            {...register("age", { required: "Required", min: { value: 10, message: "Min 10" }, max: { value: 100, message: "Max 100" } })}
                        />
                        
                        <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between items-center h-[20px]">
                                <label className="text-sm font-medium text-gray-300">Height</label>
                                <select 
                                    value={heightUnit} 
                                    onChange={(e) => {
                                        setHeightUnit(e.target.value as 'cm' | 'ft');
                                        clearErrors(["height_cm", "height_ft", "height_in"]);
                                    }}
                                    className="text-xs bg-transparent text-[#22C55E] border-none focus:outline-none cursor-pointer p-0"
                                >
                                    <option value="cm" className="bg-[#1C2331] text-white">cm</option>
                                    <option value="ft" className="bg-[#1C2331] text-white">ft & in</option>
                                </select>
                            </div>
                            <div className="relative flex items-center">
                                <div className="absolute left-3 text-[#22C55E] z-10">
                                    <Type size={18} />
                                </div>
                                {heightUnit === 'cm' ? (
                                    <div className="w-full">
                                        <input
                                            type="number"
                                            placeholder="170"
                                            className={`w-full py-2.5 pl-10 pr-4 bg-[#1C2331]/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E] text-white transition-all text-sm ${errors.height_cm ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'}`}
                                            {...register("height_cm", { required: "Required", min: { value: 50, message: "Min 50" }, max: { value: 300, message: "Max 300" } })}
                                        />
                                        {errors.height_cm && <span className="text-xs text-red-500 mt-1 block">{errors.height_cm.message as string}</span>}
                                    </div>
                                ) : (
                                    <div className="flex gap-2 w-full">
                                        <div className="w-1/2">
                                            <input
                                                type="number"
                                                placeholder="5'"
                                                className={`w-full py-2.5 pl-10 pr-2 bg-[#1C2331]/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E] text-white transition-all text-sm ${errors.height_ft ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'}`}
                                                {...register("height_ft", { required: "Required", min: { value: 1, message: "Min 1" }, max: { value: 9, message: "Max 9" } })}
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <input
                                                type="number"
                                                placeholder="8&quot;"
                                                className={`w-full py-2.5 px-3 bg-[#1C2331]/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E] text-white transition-all text-sm ${errors.height_in ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'}`}
                                                {...register("height_in", { required: "Required", min: { value: 0, message: "Min 0" }, max: { value: 11, message: "Max 11" } })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Input
                            label="Weight (kg)"
                            type="number"
                            placeholder="70"
                            icon={<Scale size={18} />}
                            error={errors.weight?.message as string}
                            {...register("weight", { required: "Required", min: 20, max: 300 })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="flex flex-col gap-1 w-full relative">
                            <label className="text-sm font-medium text-gray-300">Gender</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3 text-[#22C55E] pointer-events-none">
                                    <User size={18} />
                                </div>
                                <select 
                                    className="w-full py-2.5 pl-10 pr-4 bg-[#1C2331]/50 border border-gray-700 hover:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E] text-white text-sm appearance-none"
                                    {...register("gender", { required: "Required" })}
                                >
                                    <option value="" disabled hidden>Select gender</option>
                                    <option value="Male" className="bg-[#1C2331]">Male</option>
                                    <option value="Female" className="bg-[#1C2331]">Female</option>
                                    <option value="Other" className="bg-[#1C2331]">Other</option>
                                </select>
                                <div className="absolute right-3 text-gray-400 pointer-events-none text-xs">▼</div>
                            </div>
                            {errors.gender && <span className="text-xs text-red-500">{errors.gender.message as string}</span>}
                        </div>
                        
                        <div className="flex flex-col gap-1 w-full relative">
                            <label className="text-sm font-medium text-gray-300">Fitness Goal</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3 text-[#22C55E] pointer-events-none">
                                    <Target size={18} />
                                </div>
                                <select 
                                    className="w-full py-2.5 pl-10 pr-4 bg-[#1C2331]/50 border border-gray-700 hover:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E] text-white text-sm appearance-none"
                                    {...register("fitness_goal", { required: "Required" })}
                                >
                                    <option value="" disabled hidden>Select goal</option>
                                    <option value="Weight Loss" className="bg-[#1C2331]">Weight Loss</option>
                                    <option value="Muscle Gain" className="bg-[#1C2331]">Muscle Gain</option>
                                    <option value="Maintenance" className="bg-[#1C2331]">Maintenance</option>
                                </select>
                                <div className="absolute right-3 text-gray-400 pointer-events-none text-xs">▼</div>
                            </div>
                            {errors.fitness_goal && <span className="text-xs text-red-500">{errors.fitness_goal.message as string}</span>}
                        </div>

                        <div className="flex flex-col gap-1 w-full relative">
                            <label className="text-sm font-medium text-gray-300">Experience</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-3 text-[#22C55E] pointer-events-none">
                                    <BarChart2 size={18} />
                                </div>
                                <select 
                                    className="w-full py-2.5 pl-10 pr-4 bg-[#1C2331]/50 border border-gray-700 hover:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#22C55E] focus:border-[#22C55E] text-white text-sm appearance-none"
                                    {...register("experience_level", { required: "Required" })}
                                >
                                    <option value="" disabled hidden>Select level</option>
                                    <option value="Beginner" className="bg-[#1C2331]">Beginner</option>
                                    <option value="Intermediate" className="bg-[#1C2331]">Intermediate</option>
                                    <option value="Advanced" className="bg-[#1C2331]">Advanced</option>
                                </select>
                                <div className="absolute right-3 text-gray-400 pointer-events-none text-xs">▼</div>
                            </div>
                            {errors.experience_level && <span className="text-xs text-red-500">{errors.experience_level.message as string}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1 w-full">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                icon={<Lock size={18} />}
                                rightElement={
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-white transition-colors">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                                error={errors.password?.message as string}
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Min 8 characters" },
                                    pattern: { 
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                                        message: "Must include uppercase, lowercase, number, and special character"
                                    }
                                })}
                            />
                            {/* Password section without strength indicator */}
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                icon={<Lock size={18} />}
                                rightElement={
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="hover:text-white transition-colors">
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                }
                                error={errors.confirmPassword?.message as string}
                                {...register("confirmPassword", { 
                                    required: "Confirm Password is required",
                                    validate: value => value === password || "Passwords do not match"
                                })}
                            />
                            <div className="mt-2 text-xs text-gray-500">
                                Use 8+ characters with a mix of letters, numbers & symbols
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-full mt-6 text-white font-semibold bg-gradient-to-r from-[#4ADE80] to-[#2DD4BF] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(74,222,128,0.3)] disabled:opacity-50"
                    >
                        {isLoading ? 'Creating...' : 'Create Account'}
                        {!isLoading && <ArrowRight size={20} />}
                    </button>
                    
                    {/* End of form buttons */}
                </form>
                
                <p className="mt-8 text-center text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#22C55E] hover:underline font-medium">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};
