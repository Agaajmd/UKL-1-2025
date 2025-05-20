"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/components/forms/FormInput';
import toast, { Toaster } from 'react-hot-toast'; // Removed unused Image import

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Renamed from error to errorMessage

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Signing in...');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    username: formData.username.trim(),
                    password: formData.password
                }).toString()
            });

            const result = await response.json();
            toast.dismiss(loadingToast);

            if (result.status) {
                localStorage.setItem('userData', JSON.stringify({
                    username: formData.username,
                    isLoggedIn: true
                }));
                toast.success('Login successful! Redirecting...');
                router.push('/dashboard');
            } else {
                throw new Error(result.message || 'Invalid username or password');
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            const message = err instanceof Error ? err.message : 'Network error. Please try again.';
            toast.error(message);
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-sky-300 flex items-center justify-center p-4">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="absolute inset-0 bg-grid-sky-100 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20 pointer-events-none" />

            <div className="relative w-full max-w-md mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">
                        Welcome Back!
                    </h2>
                    <p className="mt-2 text-sm text-sky-800/90">
                        Sign in to access your account
                    </p>
                </div>

                <div className="bg-white/95 backdrop-blur-xl py-6 sm:py-8 px-6 sm:px-8 shadow-2xl rounded-xl sm:rounded-2xl border border-sky-100/50">
                    {errorMessage && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-2 text-sm font-medium text-red-700">{errorMessage}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                        <FormInput
                            label="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            placeholder="Enter your username"
                        />

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-sky-800">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-2.5 rounded-lg border border-sky-200 
                                             bg-white/80 backdrop-blur-sm shadow-sm
                                             text-sky-900 placeholder:text-sky-400/70
                                             transition-all duration-200
                                             focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20
                                             hover:border-sky-300"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 hover:text-sky-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 sm:pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 sm:py-3 px-4 
                                         rounded-lg text-sm font-medium text-white
                                         bg-gradient-to-r from-sky-500 to-blue-600 
                                         hover:from-sky-600 hover:to-blue-700
                                         focus:outline-none focus:ring-2 focus:ring-offset-2 
                                         focus:ring-sky-500 disabled:opacity-50 
                                         transition-all duration-200
                                         shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : 'Sign In'}
                            </button>
                        </div>

                        <div className="pt-4 text-center text-sm">
                            <span className="text-sky-700">Don&apos;t have an account? </span>
                            <button
                                type="button"
                                onClick={() => router.push('/')}
                                className="font-medium text-blue-600 hover:text-blue-500 
                                         transition-colors duration-200 hover:underline"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}