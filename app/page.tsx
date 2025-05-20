"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RegisterResponse {
  status: boolean;
  message: string;
  data: {
    nama_nasabah: string;
    gender: "Laki-laki" | "Perempuan";
    alamat: string;
    telepon: string;
    username: string;
    password: string;
    image: string;
  }
}

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_nasabah: '',
    gender: '',
    alamat: '',
    telepon: '',
    foto: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/register', {
        method: 'POST',
        body: formDataToSend,
      });

      const result: RegisterResponse = await response.json();

      if (response.ok && result.status) {
        setNotification({
          show: true,
          message: result.message || 'Registration successful!',
          type: 'success'
        });
        router.push('/login');
      } else {
        setNotification({
          show: true,
          message: result.message || 'Registration failed.',
          type: 'error'
        });
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, foto: e.target.files[0] });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"> {/* Changed from max-w-md to max-w-2xl */}
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Register Nasabah</h1> {/* Increased text size and margin */}

        {notification.show && (
          <div className={`p-4 mb-6 rounded-lg text-center ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased spacing between form elements */}
          <div className="grid grid-cols-2 gap-6"> {/* Added grid layout for two columns */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Nasabah</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                required
                onChange={(e) => setFormData({ ...formData, nama_nasabah: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                required
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="">Pilih Gender</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
              rows={3}
              required
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6"> {/* Added grid layout for two columns */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                required
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
              <input
                type="file"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6"> {/* Added grid layout for two columns */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                required
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5"
                  required
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-blue-600 hover:text-blue-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    // Hide password icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    // Show password icon
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Register'}
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Login here
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
