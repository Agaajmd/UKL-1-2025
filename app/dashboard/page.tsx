"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Dashboard() {
    const router = useRouter();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            router.push('/login');
            return;
        }
        const user = JSON.parse(userData);
        setUsername(user.username);
    }, [router]);

    const menuItems = [
        {
            title: 'Profile Saya',
            icon: '👤',
            description: 'Update informasi akun',
            path: '/dashboard/profile',
            bgColor: 'from-blue-400 to-blue-600'
        },
        {
            title: 'Mata Kuliah',
            icon: '📚',
            description: 'Lihat daftar mata kuliah',
            path: '/dashboard/matkul',
            bgColor: 'from-sky-400 to-sky-600'
        }
    ];

    const handleLogout = () => {
        localStorage.clear();
        toast.success('Logged out successfully');
        router.push('/login');
    };

    const handleNavigation = (path: string) => {
        try {
            router.push(path);
        } catch (err) { // Changed from error to err and using it in console.log
            console.error('Navigation failed:', err);
            toast.error('Navigation failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-sky-300 flex flex-col">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Top Welcome Message */}
            <div className="w-full py-4 sm:py-6 z-10">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center items-center">
                        <div className="text-center">
                            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600 mb-2">
                                Welcome back!
                            </h1>
                            <span className="text-lg sm:text-xl font-medium text-sky-800">{username}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 py-6 sm:py-10 flex items-center justify-center px-4">
                <div className="w-full max-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleNavigation(item.path)}
                                className="w-full text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 rounded-2xl"
                            >
                                <div className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${item.bgColor} 
                                            transform hover:scale-[1.02] transition-all duration-300
                                            hover:shadow-xl shadow-md border border-white/10`}
                                >
                                    <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                                        <span className="text-3xl sm:text-4xl">{item.icon}</span>
                                        <div className="space-y-2">
                                            <h3 className="text-xl sm:text-2xl font-bold text-white">
                                                {item.title}
                                            </h3>
                                            <p className="text-white/90 text-xs sm:text-sm">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="text-white/80 mt-2 sm:mt-4">
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Logout Button */}
            <div className="w-full py-4 sm:py-6">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <button
                            onClick={handleLogout}
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600
                                text-white font-medium hover:from-red-600 hover:to-red-700
                                transition-all duration-200 shadow-md hover:shadow-lg
                                flex items-center justify-center gap-2 hover:scale-105
                                mx-4 sm:mx-0 max-w-xs"
                        >
                            <span>🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}