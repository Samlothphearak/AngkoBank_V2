// app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiImage } from 'react-icons/fi';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    profileImage: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the user's current information from the API
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          ...formData,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: data.address,
          profileImage: data.profileImage,
        });
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add validation for required fields and password change logic here
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        alert('Settings updated successfully!');
      } else {
        const result = await res.json();
        setError(result.message || 'Error updating settings.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Profile Information</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="relative">
                  <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="relative">
                  <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="relative">
                  <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="relative md:col-span-2">
                  <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="relative md:col-span-2">
                  <FiImage className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="profileImage"
                    type="url"
                    value={formData.profileImage}
                    onChange={handleChange}
                    placeholder="Profile Image URL (optional)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Change Password</h3>
              <div className="mt-4 space-y-4">
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Current Password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="New Password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {loading ? 'Updating...' : 'Update Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}