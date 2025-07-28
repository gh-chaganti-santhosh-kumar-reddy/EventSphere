
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../../../apiConfig';
import Navbar from '../../../components/Navbar';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Login() {
  const { login } = useAuth();
  const [passwordReset, setPasswordReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('verified') === '1') {
      setMessage('Email verified successfully! You can now log in.');
    }
  }, [searchParams]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post(`${API_BASE_URL}/Auth/login`, {
      email: email,
      password: password
    })
      .then(response => {
        // API now returns { success, token, user }
        if (response.data.success) {
          login(response.data.token);
          setUser(response.data.user);
          setMessage('Login successful!');
          setTimeout(() => {
            router.push('/');
          }, 1000); // Redirect after 1s for user to see message
        } else {
          setMessage(response.data.message || 'Login failed.');
        }
      })
      .catch(error => {
        if (error.response && error.response.data?.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('An error occurred. Please try again.');
        }
      });
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post(
      `${API_BASE_URL}/Auth/forgot-password`,
      { email }
    )
      .then(() => {
        setMessage('Password reset email sent!');
      })
      .catch(error => {
        if (error.response && error.response.data?.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage('An error occurred. Please try again.');
        }
      });
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-cover bg-center flex flex-col"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        <div className="flex justify-end items-center flex-1 pr-24">
          <div className="bg-white shadow-lg rounded-lg flex w-full max-w-md overflow-hidden">
            <div className="w-full p-6">
              <h2 className="text-3xl font-bold mb-4">Login</h2>
              {passwordReset ? (
                <form onSubmit={handleResetSubmit}>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border px-4 py-2 mb-4 rounded"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded font-semibold cursor-pointer"
                    aria-label="Send password reset email"
                  >
                    Send Reset Email
                  </button>
                  <button
                    type="button"
                    className="text-blue-300 mt-3 text-xs hover:underline w-full cursor-pointer"
                    onClick={() => setPasswordReset(false)}
                    aria-label="Back to login"
                  >
                    Back to Login
                  </button>
                </form>
              ) : (
                <form className="space-y-1" onSubmit={handleLoginSubmit}>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border px-4 py-2 mb-4 rounded"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full border px-4 py-2 mb-0 rounded"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="text-blue-300 mb-5 text-xs hover:underline cursor-pointer"
                    onClick={() => setPasswordReset(true)}
                    aria-label="Forgot password"
                  >
                    Forget Password?
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded font-semibold cursor-pointer"
                    aria-label="Login"
                  >
                    Login
                  </button>
                  <p className="text-sm text-center">
                    New to EventSphere ?{" "}
                    <a href="/signup" className="text-blue-500 hover:underline cursor-pointer">
                      Sign Up
                    </a>
                  </p>
                </form>
              )}
              {message && (
                <div className="p-1 bg-gray-100 text-gray-600 rounded-b-lg">
                  <p>{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}