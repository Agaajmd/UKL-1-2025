"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import EditProfileModal from './EditProfileModal';

const API_URL = 'https://learn.smktelkom-mlg.sch.id/ukl1/api';

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
            const response = await fetch(`${API_URL}/profil`);
            const result = await response.json();

            if (result.status) {
                setProfileData(result.data);
            } else {
                throw new Error(result.message || 'Failed to load profile');
            }
        } catch (error) {
            toast.error('Failed to load profile');
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-sky-300 flex items-center justify-center py-6">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="absolute inset-0 bg-grid-sky-100 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20 pointer-events-none" />

            <div className="relative w-full max-w-2xl mx-auto px-4">
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">
                        Profile
                    </h2>
                    <p className="mt-2 text-sm text-sky-800/90">
                        Your personal information
                    </p>
                </div>

                <div className="bg-white/95 backdrop-blur-xl py-8 px-8 shadow-2xl sm:rounded-2xl border border-sky-100/50">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                        </div>
                    ) : profileData ? (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-sky-800 mb-1">
                                    Nama Pelanggan
                                </label>
                                <p className="text-sky-900 py-2">{profileData.nama_pelanggan}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-sky-800 mb-1">
                                    Gender
                                </label>
                                <p className="text-sky-900 py-2">{profileData.gender}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-sky-800 mb-1">
                                    Alamat
                                </label>
                                <p className="text-sky-900 py-2">{profileData.alamat}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-sky-800 mb-1">
                                    Telepon
                                </label>
                                <p className="text-sky-900 py-2">{profileData.telepon}</p>
                            </div>

                            <div className="pt-4 flex justify-between items-center">
                                <button
                                    onClick={() => router.push('/dashboard')}
                                    className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                                >
                                    ← Back to Dashboard
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-white
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
                        <div className="text-center py-8 text-sky-800">
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