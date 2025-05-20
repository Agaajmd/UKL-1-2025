"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/components/forms/FormInput';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';

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

// First, add a helper function at the top of your component
const validateImageFile = (file: File | null): boolean => {
  if (!file) return false;
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml'];
  return validTypes.includes(file.type);
};

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_nasabah: '',
    gender: '',
    alamat: '',
    telepon: '',
    username: '',
    password: '',
    foto: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFileError('');

    // Form validation
    if (!formData.nama_nasabah || !formData.gender || !formData.alamat ||
      !formData.telepon || !formData.username || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate image before submitting
    const foto = formData.foto;
    if (!foto || !validateImageFile(foto)) {
      setFileError('Please upload a valid image file (JPEG, PNG, JPG, GIF, or SVG)');
      setLoading(false);
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Creating your account...');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'foto' && value instanceof File) {
          formDataToSend.append('foto', value);
        } else if (key !== 'foto') {
          formDataToSend.append(key, value as string);
        }
      });

      const response = await fetch('https://learn.smktelkom-mlg.sch.id/ukl1/api/register', {
        method: 'POST',
        body: formDataToSend,
      });

      const data: RegisterResponse = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (data.status) {
        // Show success notification
        toast.success('Account created successfully! Redirecting...', {
          duration: 3000
        });

        // Redirect after a short delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        // Show error notification
        toast.error(data.message || 'Registration failed');
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error('An error occurred during registration');
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError('');

    if (file && !validateImageFile(file)) {
      setFileError('Please upload a valid image file (JPEG, PNG, JPG, GIF, or SVG)');
      e.target.value = ''; // Reset file input
      return;
    }

    setFormData({ ...formData, foto: file });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-200 to-sky-300 flex items-center justify-center py-6">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="absolute inset-0 bg-grid-sky-100 [mask-image:linear-gradient(0deg,transparent,black)] opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-2xl mx-auto px-4">
        <div className="text-center mb-6"> {/* Reduced margin */}
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-600">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-sky-800/90"> {/* Reduced margin */}
            Join us and experience seamless banking services
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl py-8 px-8 shadow-2xl sm:rounded-2xl border border-sky-100/50">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-sm font-medium text-red-700">{error}</span>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <FormInput
                  label="Nama Nasabah"
                  required
                  placeholder="Enter your full name"
                  value={formData.nama_nasabah}
                  onChange={(e) => setFormData({ ...formData, nama_nasabah: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium text-sky-800 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-lg border border-sky-200 
                             bg-white/80 backdrop-blur-sm shadow-sm
                             text-sky-900 placeholder:text-sky-400/70
                             transition-all duration-200
                             focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20
                             hover:border-sky-300"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <FormInput
                  label="Telepon"
                  type="number"
                  required
                  placeholder="Enter your phone number"
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <FormInput
                  label="Username"
                  required
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />

                <FormInput
                  label="Password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium text-sky-800 mb-2">
                    Profile Photo <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex flex-col">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-sky-200 
                               bg-white/80 backdrop-blur-sm shadow-sm
                               text-sky-900 file:mr-4 file:py-2 file:px-4
                               file:rounded-md file:border-0
                               file:text-sm file:font-medium
                               file:bg-sky-50 file:text-sky-700
                               hover:file:bg-sky-100
                               transition-all duration-200
                               focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20
                               hover:border-sky-300"
                      required
                    />
                    {fileError && (
                      <p className="mt-1 text-sm text-red-500">{fileError}</p>
                    )}
                    <p className="mt-1 text-xs text-sky-600">
                      Accepted formats: JPEG, PNG, JPG, GIF, SVG
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width Textarea */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-sky-800 mb-2">
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full px-4 py-2.5 rounded-lg border border-sky-200 
                         bg-white/80 backdrop-blur-sm shadow-sm
                         text-sky-900 placeholder:text-sky-400/70
                         transition-all duration-200
                         focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20
                         hover:border-sky-300"
                rows={3}
                placeholder="Enter your address"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                required
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 
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
                ) : 'Create Account'}
              </button>
            </div>

            <div className="pt-4 text-center text-sm">
              <span className="text-sky-700">Already have an account? </span>
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-medium text-blue-600 hover:text-blue-500 
                         transition-colors duration-200 hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
