// app/auth/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { IoWarningOutline } from 'react-icons/io5';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import BaseLayout from '@/components/layout/BaseLayout';

export default function AuthPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const [isLoading, setIsLoading] = useState(false);

    // Error message mapping
    const getErrorMessage = (error: string) => {
        const errorMessages: Record<string, string> = {
            Signin: "Authentication failed. Please try again.",
            OAuthSignin: "Could not start the Discord authentication flow.",
            OAuthCallback: "Discord authentication callback failed.",
            OAuthCreateAccount: "Could not create a user account with Discord.",
            OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
            SessionRequired: "Please sign in to access this page.",
            AccessDenied: "You don't have permission to access this resource.",
            Default: "An unexpected error occurred during authentication."
        };

        return errorMessages[error] || errorMessages.Default;
    };

    const handleSignIn = () => {
        setIsLoading(true);
        signIn('discord', { callbackUrl: '/' });
    };

    return (
        <BaseLayout>
            <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md p-8 space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                            Welcome to Manga Reader
                        </h1>
                        <p className="mt-2 text-text-secondary">
                            Sign in to access your manga collection
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-md bg-status-error/10 p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <IoWarningOutline className="h-5 w-5 text-status-error" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-status-error">
                                        {getErrorMessage(error)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <Button
                            variant="primary"
                            fullWidth
                            icon={FaDiscord}
                            isLoading={isLoading}
                            onClick={handleSignIn}
                            type="button"
                        >
                            {isLoading ? 'Connecting to Discord...' : 'Sign in with Discord'}
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-text-tertiary">
                            By signing in, you agree to our{' '}
                            <Link href="/terms" className="text-brand-light hover:text-text-primary transition-colors">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-brand-light hover:text-text-primary transition-colors">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </BaseLayout>
    );
}
