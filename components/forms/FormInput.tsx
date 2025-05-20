import { useState } from 'react';

interface FormInputProps {
    label: string;
    type?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    placeholder?: string;
    error?: string;
}

export const FormInput = ({
    label,
    type = "text",
    required = false,
    onChange,
    value,
    placeholder,
    error
}: FormInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="mb-6"> {/* Increased bottom margin */}
            <div className="space-y-2"> {/* Increased space between label and input */}
                <label className="block text-sm font-medium text-sky-800">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>

                <div className="relative">
                    <input
                        type={type === "password" ? (showPassword ? "text" : "password") : type}
                        required={required}
                        onChange={onChange}
                        value={value}
                        placeholder={placeholder}
                        className={`
                            w-full px-5 py-3 
                            bg-white/80 backdrop-blur-sm
                            border border-sky-200
                            rounded-lg
                            text-sky-900
                            placeholder:text-sky-400/70
                            transition-all duration-200
                            focus:border-sky-500 focus:ring-2 
                            focus:ring-sky-500/20
                            hover:border-sky-300
                            shadow-sm
                            ${error ? 'border-red-300 focus:ring-red-500/20' : ''}
                        `}
                    />

                    {type === "password" && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-4
                                     text-sky-400 hover:text-sky-600 transition-colors"
                        >
                            {showPassword ? (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500 mt-2 ml-1">{error}</p>
            )}
        </div>
    );
};