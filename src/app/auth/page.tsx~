// app/auth/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { BiErrorCircle } from 'react-icons/bi';
import { ImSpinner8 } from 'react-icons/im';
import Image from 'next/image';

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
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 px-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="mb-8 text-center">
                    {/* Replace with your actual logo */}
                    <div className="mx-auto h-16 w-16 rounded-full bg-purple-800 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">MR</span>
                    </div>
                    <h1 className="mt-4 text-3xl font-bold text-white">Manga Reader</h1>
                    <p className="mt-2 text-neutral-400">Your personal manga collection</p>
                </div>

                {/* Auth Card */}
                <div className="overflow-hidden rounded-xl bg-neutral-700 shadow-lg">
                    {/* Card Header */}
                    <div className="border-b border-neutral-600 bg-neutral-800 px-6 py-4">
                        <h2 className="text-lg font-medium text-white">Sign in to continue</h2>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 rounded-lg bg-red-900/20 p-4">
                                <div className="flex">
                                    <BiErrorCircle className="h-5 w-5 text-red-500" />
                                    <div className="ml-3">
                                        <p className="text-sm text-red-300">
                                            {getErrorMessage(error)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sign-in Button */}
                        <button
                            onClick={handleSignIn}
                            disabled={isLoading}
                            className={`flex w-full items-center justify-center gap-3 rounded-lg
                ${isLoading ? 'bg-purple-900 cursor-not-allowed' :
                                'bg-purple-800 hover:bg-purple-700 active:bg-purple-900'}
                px-4 py-3.5 text-white transition-colors duration-200`}
                        >
                            {isLoading ? (
                                <>
                                    <ImSpinner8 className="h-5 w-5 animate-spin" />
                                    <span>Connecting to Discord...</span>
                                </>
                            ) : (
                                <>
                                    <FaDiscord className="h-5 w-5" />
                                    <span>Continue with Discord</span>
                                </>
                            )}
                        </button>

                        {/* Terms & Privacy */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-neutral-400">
                                By signing in, you agree to our{' '}
                                <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Guest Access */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => window.location.href = '/explore'}
                        className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                        Continue as guest
                    </button>
                </div>
            </div>
        </div>
    );
}
