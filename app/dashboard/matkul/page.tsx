"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Matkul {
    id: string;
    nama_matkul: string;
    sks: number;
}

interface MatkulResponse {
    status: boolean;
    message: string;
    data: Matkul[];
}

interface SelectMatkulResponse {
    status: boolean;
    message: string;
    data: {
        list_matkul: Matkul[];
    }
}

export default function Matkul() {
    const router = useRouter();
    const [matkul, setMatkul] = useState<Matkul[]>([]);
    const [selectedMatkul, setSelectedMatkul] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchMatkul();
    }, []);

    const fetchMatkul = async () => {
        const loadingToast = toast.loading('Loading mata kuliah...');
        try {
            const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/getmatkul');
            const result: MatkulResponse = await response.json();

            if (result.status) {
                setMatkul(result.data);
                toast.dismiss(loadingToast);
            } else {
                throw new Error(result.message || 'Failed to load mata kuliah');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Failed to load mata kuliah');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (selectedMatkul.length === 0) {
            toast.error('Pilih minimal satu mata kuliah');
            return;
        }

        setSubmitting(true);
        const loadingToast = toast.loading('Menyimpan pilihan...');

        try {
            const selectedCourses = matkul
                .filter(m => selectedMatkul.includes(m.id))
                .map(m => ({
                    id: m.id,
                    nama_matkul: m.nama_matkul,
                    sks: m.sks
                }));

            const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/selectmatkul', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    list_matkul: selectedCourses
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result: SelectMatkulResponse = await response.json();

            toast.dismiss(loadingToast);
            if (result.status) {
                toast.success(result.message || 'Mata kuliah berhasil dipilih!');
                setSelectedMatkul([]);
                router.push('/dashboard');
            } else {
                throw new Error(result.message || 'Gagal memilih mata kuliah');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Gagal menyimpan pilihan');
            console.error('Error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-sky-300 flex items-center justify-center py-6">
            <Toaster position="top-center" reverseOrder={false} />

            <div className="absolute inset-0 bg-grid-sky-100 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20 pointer-events-none" />

            <div className="relative w-full max-w-4xl mx-auto px-4">
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">
                        Pemilihan Mata Kuliah
                    </h2>
                    <p className="mt-2 text-sm text-sky-800/90">
                        Pilih mata kuliah yang ingin Anda ambil
                    </p>
                </div>

                <div className="bg-white/95 backdrop-blur-xl py-8 px-8 shadow-2xl sm:rounded-2xl border border-sky-100/50">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-hidden rounded-xl border border-sky-200 mb-6">
                                <table className="min-w-full divide-y divide-sky-200">
                                    <thead className="bg-sky-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                                                Pilih
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                                                Mata Kuliah
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sky-700 uppercase tracking-wider">
                                                SKS
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-sky-200">
                                        {matkul.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-sky-50 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMatkul.includes(item.id)}
                                                        onChange={(e) => {
                                                            setSelectedMatkul(prev =>
                                                                e.target.checked
                                                                    ? [...prev, item.id]
                                                                    : prev.filter(id => id !== item.id)
                                                            );
                                                        }}
                                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-sky-300 rounded 
                                                                 transition-all duration-200 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-900">
                                                    {item.nama_matkul}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-sky-900">
                                                    {item.sks}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="text-sm text-sky-600 font-medium">
                                    Mata Kuliah terpilih: {selectedMatkul.length}
                                </div>
                                <div className="space-x-4">
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="px-4 py-2 text-sky-600 hover:text-sky-700 font-medium"
                                    >
                                        ← Kembali
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting || selectedMatkul.length === 0}
                                        className="px-6 py-2.5 rounded-lg text-white font-medium
                                                 bg-gradient-to-r from-sky-500 to-blue-600 
                                                 hover:from-sky-600 hover:to-blue-700
                                                 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                                 focus:ring-sky-500 disabled:opacity-50 
                                                 transition-all duration-200
                                                 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {submitting ? (
                                            <span className="flex items-center space-x-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                <span>Processing...</span>
                                            </span>
                                        ) : 'Simpan Pilihan'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}