import React from 'react';
import { IconType } from 'react-icons';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'sm' | 'md' | 'lg';
    icon?: IconType;
    iconPosition?: 'left' | 'right';
    isLoading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

export default function Button({
                                   children,
                                   variant = 'primary',
                                   size = 'md',
                                   icon: Icon,
                                   iconPosition = 'left',
                                   isLoading = false,
                                   disabled = false,
                                   fullWidth = false,
                                   onClick,
                                   type = 'button',
                               }: ButtonProps) {
    const baseClasses = "flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary";

    const variantClasses = {
        primary: "bg-brand-primary hover:bg-brand-hover active:bg-brand-active text-white focus:ring-brand-primary",
        secondary: "bg-background-elevated hover:bg-background-tertiary active:bg-background-secondary text-text-primary focus:ring-background-elevated",
        tertiary: "bg-transparent hover:bg-background-tertiary active:bg-background-secondary text-text-primary focus:ring-background-elevated"
    };

    const sizeClasses = {
        sm: "text-sm px-3 py-1.5 gap-1.5",
        md: "text-base px-4 py-2 gap-2",
        lg: "text-lg px-6 py-3 gap-2.5"
    };

    const widthClass = fullWidth ? "w-full" : "";
    const disabledClass = disabled || isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass}`}
        >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </>
            ) : (
                <>
                    {Icon && iconPosition === 'left' && <Icon className="flex-shrink-0" />}
                    {children}
                    {Icon && iconPosition === 'right' && <Icon className="flex-shrink-0" />}
                </>
            )}
        </button>
    );
}
