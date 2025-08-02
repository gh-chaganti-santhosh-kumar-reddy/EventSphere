"use client";
// Helper to get full image URL
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5274";
const getImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("/uploads/")) return backendUrl + url;
  return url;
};
 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
 
export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    phone: string;
    imageUrl: string;
    imageFile: File | null;
    imagePreview: string;
  }>({
    name: '',
    email: '',
    phone: '',
    imageUrl: '',
    imageFile: null,
    imagePreview: ''
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  // For change password modal
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState('');
 
  useEffect(() => {
    // Fetch user profile using GET /api/Users/{id}
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        const user = userStr ? JSON.parse(userStr) : null;
        const userId = user?.userId || user?.id || user?.UserId || user?.Id;
        if (!userId) {
          setMessage('User not found.');
          setLoading(false);
          return;
        }
        const res = await fetch(`http://localhost:5274/api/Users/${userId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        });
        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || '',
            email: data.email || '',
            phone: data.phoneNumber || data.phone || '',
            imageUrl: data.profileImage || data.imageUrl || '',
            imageFile: null,
            imagePreview: data.profileImage || data.imageUrl || ''
          });
        } else {
          setMessage('Failed to load profile.');
        }
      } catch (err) {
        setMessage('Error loading profile.');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
 
  // Handle profile image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, imageFile: file, imagePreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
 
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditing(true);
    setMessage('');
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('phoneNumber', profile.phone);
      if (profile.imageFile) {
        formData.append('profileImage', profile.imageFile);
      }
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const user = userStr ? JSON.parse(userStr) : null;
      const userId = user?.userId || user?.id || user?.UserId || user?.Id;
      if (!userId) {
        setMessage('User not found.');
        setEditing(false);
        return;
      }
      const res = await fetch(`http://localhost:5274/api/Users/${userId}`, {
        method: 'PATCH',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });
      if (res.ok) {
        setMessage('Profile updated successfully!');
        setEditMode(false);
        setProfile((prev) => ({ ...prev, imageFile: null }));
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (err) {
      setMessage('Error updating profile.');
    }
    setEditing(false);
  };
 
  if (loading) return <div className="p-8 text-center">Loading...</div>;
 
  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-3xl shadow-2xl p-12 md:p-16">
      <h2 className="text-2xl font-bold mb-6 text-center"> Profile</h2>
      {message && <div className="mb-4 text-center text-sm text-red-500">{message}</div>}
      {!editMode ? (
        <div className="flex flex-col md:flex-row gap-0 items-center md:items-start w-full">
          {/* Left: Profile Image */}
          <div className="flex flex-col items-center md:items-start w-full md:w-[38%] mb-6 md:mb-0 md:pr-8 md:-ml-8">
            <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-4 border-orange-300 shadow-xl">
              {profile.imagePreview || profile.imageUrl ? (
                <img
                  src={getImageUrl(profile.imagePreview || profile.imageUrl)}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-5xl text-gray-400">👤</span>
              )}
            </div>
            {/* Show Change Image button only in edit mode */}
            {/* Nothing rendered in view mode */}
          </div>
          {/* Right: Details */}
          <div className="hidden md:block h-full border-r border-gray-200 mx-2" style={{ minHeight: '220px' }} />
          <div className="flex flex-col gap-5 w-full md:w-[62%] md:pl-8 items-start justify-start md:justify-center">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-2">
                <span className="font-medium text-lg text-gray-700">Name:</span>
                <span className="text-gray-900 text-lg font-semibold">{profile.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-800">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="text-gray-800">{profile.phone}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
            <button
              type="button"
              className="py-2 px-4 rounded bg-blue-500 text-white font-semibold text-base hover:bg-blue-600 transition-all"
              onClick={() => {
                setShowChangePassword(true);
                setResetEmail(profile.email);
                setResetMsg('');
              }}
            >
              Change Password
            </button>
              <button
                className="py-2 px-5 rounded bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all text-base"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-0 items-center md:items-start w-full">
          {/* Left: Profile Image */}
          <div className={`flex flex-col ${editMode ? 'items-center' : 'items-center md:items-start'} w-full md:w-[38%] mb-6 md:mb-0 md:pr-8`}>
            <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-4 border-orange-300 shadow-xl">
              {profile.imagePreview || profile.imageUrl ? (
                <img
                  src={getImageUrl(profile.imagePreview || profile.imageUrl)}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-5xl text-gray-400">👤</span>
              )}
            </div>
            {/* Show Change Image button only in edit mode */}
            {editMode && (
              <div className="flex justify-center w-full mt-3">
                <label className="px-3 py-1.5 bg-white border border-gray-400 rounded-md shadow-sm cursor-pointer text-sm font-medium hover:bg-orange-50 hover:border-orange-400 transition-all mx-auto">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
          {/* Right: Details */}
          <div className="hidden md:block h-full border-r border-gray-200 mx-2" style={{ minHeight: '220px' }} />
          <div className="flex flex-col gap-5 w-full md:w-[62%] md:pl-8 items-start justify-start md:justify-center">
            <label className="font-medium w-full">Name
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </label>
            <label className="font-medium w-full">Email
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </label>
            <label className="font-medium w-full">Phone
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </label>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="py-2 px-4 rounded bg-green-600 text-white font-bold hover:bg-green-700 transition-all"
                disabled={editing}
              >
                {editing ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="py-2 px-4 rounded bg-gray-300 text-gray-700 font-bold hover:bg-gray-400 transition-all"
                onClick={() => { setEditMode(false); setProfile((prev) => ({ ...prev, imageFile: null, imagePreview: prev.imageUrl })); setMessage(''); }}
                disabled={editing}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs sm:max-w-sm relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowChangePassword(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-center">Change Password</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setResetLoading(true);
                setResetMsg('');
                try {
                  const res = await fetch('http://localhost:5274/api/Auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: resetEmail })
                  });
                  if (res.ok) {
                    setResetMsg('Password reset email sent! Redirecting to login...');
                    setTimeout(() => {
                      router.push('/Login');
                    }, 800);
                  } else {
                    const data = await res.json();
                    setResetMsg(data.message || 'An error occurred. Please try again.');
                  }
                } catch (err) {
                  setResetMsg('An error occurred. Please try again.');
                }
                setResetLoading(false);
              }}
              className="space-y-3"
            >
              <input
                type="email"
                placeholder="Email"
                className="w-full border px-3 py-2 rounded text-sm"
                required
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                disabled={resetLoading}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center"
                aria-label="Send password reset email"
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Sending reset email...
                  </>
                ) : (
                  'Send Reset Email'
                )}
              </button>
              {resetMsg && (
                <div className={`p-2 rounded mt-2 text-center ${resetMsg.toLowerCase().includes('error') ? 'bg-red-200 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  <p>{resetMsg}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}