"use client"
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface ProfileData {
    id: string;
    nama_pelanggan: string;
    alamat: string;
    gender: "laki-laki" | "perempuan"; // Updated to match API enum
    telepon: string;
}

type Props = {
    item: ProfileData;
    onClose: () => void;
}

const API_URL = 'https://learn.smktelkom-mlg.sch.id/ukl1/api';

export default function EditProfileModal({ item, onClose }: Props) {
    const [nama_pelanggan, setNamaPelanggan] = useState<string>(item.nama_pelanggan);
    const [alamat, setAlamat] = useState<string>(item.alamat);
    const [gender, setGender] = useState<"laki-laki" | "perempuan">(item.gender.toLowerCase() as "laki-laki" | "perempuan");
    const [telepon, setTelepon] = useState<string>(item.telepon);
    const [show, setShow] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const closeModal = () => {
        setShow(false);
        onClose();
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Updating profile...');

        try {
            const formData = new URLSearchParams();
            // Include ID in update request
            formData.append('id', item.id);
            formData.append('nama_pelanggan', nama_pelanggan);
            formData.append('alamat', alamat);
            formData.append('gender', gender);
            formData.append('telepon', telepon);

            const response = await fetch(`${API_URL}/update/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });

            const result = await response.json();

            if (result.status) {
                toast.success(result.message || 'Profile updated successfully!');
                closeModal();
                // Refresh the page to show updated data
                setTimeout(() => router.refresh(), 1000);
            } else {
                throw new Error(result.message || 'Update failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        } finally {
            toast.dismiss(loadingToast);
            setLoading(false);
        }
    }

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Toaster position="top-center" />

            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-sky-900 mb-4">
                        Edit Profile
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-sky-800 mb-1">
                                Nama Pelanggan
                            </label>
                            <input
                                type="text"
                                maxLength={255}
                                className="w-full px-3 py-2 rounded-lg border border-sky-200 
                                         focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                required
                                value={nama_pelanggan}
                                onChange={(e) => setNamaPelanggan(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-sky-800 mb-1">
                                Gender
                            </label>
                            <select
                                className="w-full px-3 py-2 rounded-lg border border-sky-200 
                                         focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                required
                                value={gender}
                                onChange={(e) => setGender(e.target.value as "laki-laki" | "perempuan")}
                            >
                                <option value="laki-laki">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-sky-800 mb-1">
                                Alamat
                            </label>
                            <textarea
                                className="w-full px-3 py-2 rounded-lg border border-sky-200 
                                         focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                rows={3}
                                required
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-sky-800 mb-1">
                                Telepon
                            </label>
                            <input
                                type="tel"
                                maxLength={20}
                                className="w-full px-3 py-2 rounded-lg border border-sky-200 
                                         focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                required
                                value={telepon}
                                pattern="[0-9]+"
                                onChange={(e) => setTelepon(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-medium text-sky-700 hover:text-sky-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white
                                         bg-gradient-to-r from-sky-500 to-blue-600 
                                         hover:from-sky-600 hover:to-blue-700
                                         rounded-lg shadow-md hover:shadow-lg
                                         transition-all duration-200
                                         disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}