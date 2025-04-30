"use client";

import { useState } from "react";
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiArrowLeft, FiHome } from "react-icons/fi";
import { useRouter } from "next/navigation";
import axios from "axios";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  city: string;
  district: string;
  commune: string;
  village: string;
};

const addressData = {
  PhnomPenh: {
    Chamkarmon: {
      BoengKengKang: ["Village1", "Village2"],
      TonleBassac: ["Village3"],
      Olympic: ["Village4"],
      PhsarThmei: ["Village5"],
    },
    // ... (rest of your address data remains the same)
  },
  // ... (other provinces)
};

const RegisterPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    city: "",
    district: "",
    commune: "",
    village: "",
  });

  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === "city" && { district: "", commune: "", village: "" }),
      ...(name === "district" && { commune: "", village: "" }),
      ...(name === "commune" && { village: "" }),
    }));

    if (name === "password") {
      const strength = getPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return "Weak";
    if (/[A-Z]/.test(password) && /\d/.test(password)) return "Strong";
    return "Medium";
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return formData.firstName.trim() !== "" && formData.lastName.trim() !== "";
      case 2:
        return (
          formData.email.trim() !== "" &&
          formData.phoneNumber.trim() !== "" &&
          formData.password.trim() !== "" &&
          formData.confirmPassword.trim() !== "" &&
          formData.password === formData.confirmPassword
        );
      case 3:
        return (
          formData.city.trim() !== "" &&
          formData.district.trim() !== "" &&
          formData.commune.trim() !== "" &&
          formData.village.trim() !== ""
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setError("");
    } else {
      setError("Please fill in all required fields correctly.");
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) {
      setError("Please fill in all required fields correctly.");
      return;
    }
  
    try {
      const response = await axios.post("/api/auth/register", formData);
      if (response.status === 201) {
        router.push("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Registration failed");
      } else {
        setError("Network error or server is unavailable.");
      }
    }
  };

  // Progress bar calculation
  const progress = (step / 3) * 100;

  // Cascading dropdown data
  const cities = Object.keys(addressData);
  const districts = formData.city ? Object.keys(addressData[formData.city]) : [];
  const communes =
    formData.city && formData.district
      ? Object.keys(addressData[formData.city][formData.district])
      : [];
  const villages =
    formData.city && formData.district && formData.commune
      ? addressData[formData.city][formData.district][formData.commune]
      : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-100">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 3</span>
            <span className="text-sm font-medium text-blue-600">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
                <p className="text-gray-600">Let's start with your basic details</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  icon={<FiUser className="text-gray-500" />}
                  required
                />
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  icon={<FiUser className="text-gray-500" />}
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                  <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact Information</h2>
                <p className="text-gray-600">How can we reach you?</p>
              </div>
              
              <div className="space-y-4">
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  icon={<FiMail className="text-gray-500" />}
                  required
                />
                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  icon={<FiPhone className="text-gray-500" />}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  icon={<FiLock className="text-gray-500" />}
                  required
                />
                {formData.password && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-700">
                      Password strength:{" "}
                      <span
                        className={`font-medium ${
                          passwordStrength === "Strong"
                            ? "text-green-600"
                            : passwordStrength === "Medium"
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {passwordStrength}
                      </span>
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        className={`h-1 rounded-full ${
                          passwordStrength === "Strong"
                            ? "bg-green-500 w-full"
                            : passwordStrength === "Medium"
                            ? "bg-amber-500 w-2/3"
                            : "bg-red-500 w-1/3"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  icon={<FiLock className="text-gray-500" />}
                  required
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiArrowLeft className="mr-2" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                  <FiArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Address Information</h2>
                <p className="text-gray-600">Where should we send your banking materials?</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  options={cities}
                  placeholder="Select City/Province"
                  icon={<FiHome className="text-gray-500" />}
                />
                <Select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  options={districts}
                  placeholder="Select District"
                  disabled={!formData.city}
                  icon={<FiHome className="text-gray-500" />}
                />
                <Select
                  name="commune"
                  value={formData.commune}
                  onChange={handleChange}
                  options={communes}
                  placeholder="Select Commune"
                  disabled={!formData.district}
                  icon={<FiHome className="text-gray-500" />}
                />
                <Select
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  options={villages}
                  placeholder="Select Village"
                  disabled={!formData.commune}
                  icon={<FiHome className="text-gray-500" />}
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiArrowLeft className="mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Complete Registration
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

// --- Reusable Components ---

const Input = ({
  name,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  required = false,
}: {
  name: string;
  value: string;
  onChange: any;
  placeholder: string;
  icon: JSX.Element;
  type?: string;
  required?: boolean;
}) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
      {icon}
    </span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
    />
  </div>
);

const Select = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  icon,
}: {
  name: string;
  value: string;
  onChange: any;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  icon?: JSX.Element;
}) => (
  <div className="relative">
    {icon && (
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {icon}
      </span>
    )}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${
        disabled ? "bg-gray-100 text-gray-500" : ""
      }`}
      required
      disabled={disabled}
    >
      <option value="" className="text-gray-400">
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="text-gray-800">
          {opt}
        </option>
      ))}
    </select>
  </div>
);