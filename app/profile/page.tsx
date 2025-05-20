"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProfileResponse {
    status: boolean;
    message: string;
    data: {
        id: string;
        nama_pelanggan: string;
        alamat: string;
        gender: "Laki-laki" | "Perempuan";
        telepon: string;
    }
}

export default function Profile() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        id: '',
        nama_pelanggan: '',
        alamat: '',
        gender: 'Laki-laki' as "Laki-laki" | "Perempuan",
        telepon: ''
    });
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/profil', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                const result: ProfileResponse = await response.json();

                if (response.ok && result.status) {
                    setFormData(result.data);
                } else {
                    setNotification({
                        show: true,
                        message: result.message || 'Failed to load profile',
                        type: 'error'
                    });
                    if (response.status === 401) {
                        router.push('/login');
                    }
                }
            } catch (error) {
                setNotification({
                    show: true,
                    message: 'Network error occurred',
                    type: 'error'
                });
            }
        };

        fetchProfile();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    nama_pelanggan: formData.nama_pelanggan,
                    alamat: formData.alamat,
                    gender: formData.gender,
                    telepon: formData.telepon
                }),
            });

            const result = await response.json();

            if (response.ok && result.status) {
                setNotification({
                    show: true,
                    message: result.message || 'Profile updated successfully!',
                    type: 'success'
                });
            } else {
                setNotification({
                    show: true,
                    message: result.message || 'Update failed.',
                    type: 'error'
                });
                if (response.status === 401) {
                    router.push('/login');
                }
            }
        } catch (error) {
            setNotification({
                show: true,
                message: 'Network error occurred.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">My Profile</h1>

                {notification.show && (
                    <div className={`p-4 mb-6 rounded-lg text-center ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {notification.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Pelanggan
                        </label>
                        <input
                            type="text"
                            value={formData.nama_pelanggan}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                            required
                            onChange={(e) => setFormData({ ...formData, nama_pelanggan: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                        </label>
                        <select
                            value={formData.gender}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                            required
                            onChange={(e) => setFormData({
                                ...formData,
                                gender: e.target.value as "Laki-laki" | "Perempuan"
                            })}
                        >
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alamat
                        </label>
                        <textarea
                            value={formData.alamat}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                            rows={3}
                            required
                            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telepon
                        </label>
                        <input
                            type="tel"
                            value={formData.telepon}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                            required
                            maxLength={20}
                            pattern="[0-9]*"
                            onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}