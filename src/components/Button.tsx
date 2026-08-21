import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
    children, 
    variant = 'primary', 
    isLoading, 
    className = '', 
    ...props 
}) => {
    const baseStyles = "w-full px-4 py-2 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2";
    
    const variants = {
        primary: "bg-[#00E5FF] text-black hover:bg-[#00c5df] shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)]",
        secondary: "bg-[#22C55E] text-white hover:bg-[#1ea850] shadow-[0_0_15px_rgba(34,197,94,0.3)]",
        outline: "border-2 border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black"
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : null}
            {children}
        </button>
    );
};
