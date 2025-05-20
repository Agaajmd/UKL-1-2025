"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginResponse {
    status: boolean;
    message: string;
}

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Form validation
        if (!formData.username || !formData.password) {
            setNotification({
                show: true,
                message: 'Username and password are required',
                type: 'error'
            });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                // Convert to URL encoded form data
                body: new URLSearchParams({
                    username: formData.username,
                    password: formData.password
                }).toString()
            });

            const result: LoginResponse = await response.json();

            if (response.ok) {
                if (result.status) {
                    setNotification({
                        show: true,
                        message: result.message || 'Login successful!',
                        type: 'success'
                    });
                    // Store any necessary data in localStorage if needed
                    localStorage.setItem('isLoggedIn', 'true');
                    router.push('/profile'); // Redirect to profile page
                } else {
                    setNotification({
                        show: true,
                        message: result.message || 'Invalid credentials',
                        type: 'error'
                    });
                }
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            setNotification({
                show: true,
                message: 'Login failed. Please try again.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Login Nasabah</h1>

                {notification.show && (
                    <div className={`p-4 mb-6 rounded-lg text-center ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                            required
                            minLength={3}
                            value={formData.username}
                            placeholder="Enter username"
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                                required
                                minLength={8}
                                value={formData.password}
                                placeholder="Enter password"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-blue-600 hover:text-blue-800"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Login'}
                        </button>

                        <div className="text-center">
                            <span className="text-sm text-gray-600">Don't have an account? </span>
                            <button
                                type="button"
                                onClick={() => router.push('/')}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Register here
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}