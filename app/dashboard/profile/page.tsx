"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import EditProfileModal from './EditProfileModal';

interface ProfileData {
    id: string;
    nama_pelanggan: string;
    alamat: string;
    gender: "laki-laki" | "perempuan";
    telepon: string;
}

export default function Profile() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const loadingToast = toast.loading('Loading profile...');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profil`);
            const result = await response.json();

            if (result.status) {
                setProfileData(result.data);
            } else {
                throw new Error(result.message || 'Failed to load profile');
            }
        } catch (error) { // Changed from err to error for consistency
            console.error('Failed to fetch profile:', error);
            toast.error('Failed to load profile');
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-sky-300 flex items-center justify-center p-4 sm:py-6">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="absolute inset-0 bg-grid-sky-100 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20 pointer-events-none" />

            <div className="relative w-full max-w-2xl mx-auto">
                <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">
                        Profile
                    </h2>
                    <p className="mt-2 text-sm text-sky-800/90">
                        Your personal information
                    </p>
                </div>

                <div className="bg-white/95 backdrop-blur-xl py-6 sm:py-8 px-4 sm:px-8 shadow-2xl rounded-xl sm:rounded-2xl border border-sky-100/50">
                    {loading ? (
                        <div className="flex justify-center py-6 sm:py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                        </div>
                    ) : profileData ? (
                        <div className="space-y-4 sm:space-y-6">
                            {/* Profile Fields */}
                            {[
                                { label: 'Nama Pelanggan', value: profileData.nama_pelanggan },
                                { label: 'Gender', value: profileData.gender },
                                { label: 'Alamat', value: profileData.alamat },
                                { label: 'Telepon', value: profileData.telepon }
                            ].map((field, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-sky-800 mb-1">
                                        {field.label}
                                    </label>
                                    <p className="text-sky-900 py-1.5 sm:py-2 text-sm sm:text-base">
                                        {field.value}
                                    </p>
                                </div>
                            ))}

                            {/* Buttons */}
                            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-center gap-4 sm:gap-0">
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="w-full sm:w-auto text-center sm:text-left text-sm text-sky-600 hover:text-sky-700 font-medium"
                                >
                                    ← Back to Dashboard
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium text-white
                                             bg-gradient-to-r from-sky-500 to-blue-600 
                                             hover:from-sky-600 hover:to-blue-700
                                             transition-all duration-200
                                             shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 sm:py-8 text-sky-800">
                            Failed to load profile data
                        </div>
                    )}
                </div>
            </div>

            {isEditModalOpen && profileData && (
                <EditProfileModal
                    item={profileData}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </div>
    );
}