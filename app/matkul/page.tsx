"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Matkul {
    id: string;
    nama_matkul: string;
    sks: string;
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
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Fetch matkul list
    useEffect(() => {
        const fetchMatkul = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/getmatkul', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                const result: MatkulResponse = await response.json();

                if (response.ok && result.status) {
                    setMatkul(result.data);
                } else {
                    setNotification({
                        show: true,
                        message: result.message || 'Failed to load courses',
                        type: 'error'
                    });
                }
            } catch (error) {
                setNotification({
                    show: true,
                    message: 'Network error occurred',
                    type: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMatkul();
    }, [router]);

    const handleSubmit = async () => {
        if (selectedMatkul.length === 0) {
            setNotification({
                show: true,
                message: 'Please select at least one course',
                type: 'error'
            });
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const selectedCourses = matkul.filter(m => selectedMatkul.includes(m.id));

            const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/selectmatkul', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    list_matkul: selectedCourses
                }),
            });

            const result: SelectMatkulResponse = await response.json();

            if (response.ok && result.status) {
                setNotification({
                    show: true,
                    message: result.message || 'Courses selected successfully!',
                    type: 'success'
                });
                setSelectedMatkul([]); // Reset selection after successful submission
            } else {
                setNotification({
                    show: true,
                    message: result.message || 'Failed to submit selected courses',
                    type: 'error'
                });
            }
        } catch (error) {
            setNotification({
                show: true,
                message: 'Network error occurred',
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Pilih Mata Kuliah</h1>

                {notification.show && (
                    <div className={`p-4 mb-6 rounded-lg text-center ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {notification.message}
                    </div>
                )}

                {loading ? (
                    <div className="text-center text-gray-600">Loading...</div>
                ) : (
                    <>
                        <div className="overflow-x-auto mb-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Select
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama Mata Kuliah
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SKS
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {matkul.map((item, index) => (
                                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMatkul.includes(item.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedMatkul([...selectedMatkul, item.id]);
                                                        } else {
                                                            setSelectedMatkul(selectedMatkul.filter(id => id !== item.id));
                                                        }
                                                    }}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.nama_matkul}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.sks}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || selectedMatkul.length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Selected Courses'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}