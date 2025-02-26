// components/layout/BaseLayout.tsx
import React from 'react';

interface BaseLayoutProps {
    children: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
    return (
        <div className="min-h-screen bg-background-primary text-text-primary">
            {children}
        </div>
    );
}
