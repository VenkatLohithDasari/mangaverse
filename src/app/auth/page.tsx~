'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

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
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-800 p-8 shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Welcome to Manga Reader
                    </h1>
                    <p className="mt-2 text-gray-400">
                        Sign in to access your manga collection
                    </p>
                </div>

                {error && (
                    <div className="mt-4 rounded-md bg-red-900/30 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-300">
                                    {getErrorMessage(error)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 space-y-4">
                    <button
                        onClick={handleSignIn}
                        disabled={isLoading}
                        className={`flex w-full items-center justify-center gap-3 rounded-lg ${
                            isLoading ? 'bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'
                        } px-4 py-3 text-white transition-colors`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Connecting to Discord...</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                                </svg>
                                <span>Sign in with Discord</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        By signing in, you agree to our{' '}
                        <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
