import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: ReactNode;
    rightElement?: ReactNode;
    theme?: 'green' | 'cyan';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, rightElement, className = '', theme = 'green', ...props }, ref) => {
        const themeClasses = {
            green: {
                icon: 'text-[#22C55E]',
                focus: 'focus:ring-[#22C55E] focus:border-[#22C55E]'
            },
            cyan: {
                icon: 'text-[#00E5FF]',
                focus: 'focus:ring-[#00E5FF] focus:border-[#00E5FF]'
            }
        };
        const currentTheme = themeClasses[theme];

        return (
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-gray-300">
                    {label}
                </label>
                <div className="relative flex items-center">
                    {icon && (
                        <div className={`absolute left-3 ${currentTheme.icon}`}>
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
                            w-full py-2.5 bg-[#1C2331]/50 border rounded-lg 
                            focus:outline-none focus:ring-1 ${currentTheme.focus}
                            text-white transition-all text-sm
                            ${icon ? 'pl-10' : 'px-4'}
                            ${rightElement ? 'pr-10' : 'pr-4'}
                            ${error ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'}
                            ${className}
                        `}
                        {...props}
                    />
                    {rightElement && (
                        <div className="absolute right-3 text-gray-400 flex items-center">
                            {rightElement}
                        </div>
                    )}
                </div>
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        );
    }
);
Input.displayName = 'Input';
