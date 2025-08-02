"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [passwordReset, setPasswordReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [resetLoading, setResetLoading] = useState(false); // Loading state for password reset

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setMessage('');
    axios.post('http://localhost:5274/api/Auth/login', {
      email: email,
      password: password
    })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        // Store user info in localStorage for Navbar username
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setMessage('Login successful!');
        // Redirect to home page after successful login
        router.push('/dashboard');
      })
      .catch(error => {
        if (error.response) {
          setMessage(error.response.data.message);
        } else {
          setMessage('An error occurred. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true); // Start loading for reset
    setMessage('');

    axios.post(
      'http://localhost:5274/api/Auth/forgot-password',
      {email}
    )
    .then(response => {
      setMessage('Password reset email sent!');
    })
    .catch(error => {
      if (error.response && error.response.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('An error occurred. Please try again.');
      }
    })
    .finally(() => {
      setResetLoading(false); // Stop loading for reset
    });
  };



  return (
    <>
      
      <div className="bg-cover bg-center bg-fixed flex flex-col min-h-screen px-2 sm:px-4 flex-1 justify-center items-center" style={{ backgroundImage: "url('/images/bg.png')" }}>
        {/* Lazy loaded background image for SEO and performance (optional, for decorative bg) */}
        <Image
          src="/images/bg.png"
          alt="Background"
          fill
          className="object-cover w-full h-full fixed inset-0 -z-10"
          loading="lazy"
        />
        
        <div className="flex justify-center items-center flex-1 relative z-10 w-full">
          <div className="bg-white/80 sm:bg-white shadow-lg rounded-lg flex w-full max-w-xs sm:max-w-md md:max-w-lg backdrop-blur-md">
            <div className="w-full p-3 sm:p-6 z-0">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center">Login</h2>
              {passwordReset ? (
                <form onSubmit={handleResetSubmit} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-200 flex items-center justify-center text-base sm:text-lg"
                    aria-label="Send password reset email"
                    disabled={resetLoading}
                  >
                    {resetLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Sending reset email...
                      </>
                    ) : (
                      "Send Reset Email"
                    )}
                  </button>
                  <button
                    type="button"
                    className="text-blue-300 mt-3 text-xs sm:text-sm hover:underline w-full"
                    onClick={() => setPasswordReset(false)}
                    aria-label="Back to login"
                  >
                    Back to Login
                  </button>
                </form>
              ) : (
                <form className="space-y-3" onSubmit={handleLoginSubmit}>
                  
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                   
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="mb-3 text-xs sm:text-sm text-right">
                    <button
                      type="button"
                      className="text-blue-300 hover:underline"
                      onClick={() => setPasswordReset(true)}
                      aria-label="Forgot password"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white py-2 rounded font-semibold hover:bg-gradient-to-r hover:from-[rgba(4,195,216,1)] hover:to-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-200 flex items-center justify-center text-base sm:text-lg"
                    style={{ background: "rgba(4,195,216,1)" }}
                    aria-label="Login"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Logging you in, please wait...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                  <p className="text-xs sm:text-sm text-center">
                    New to EventSphere?{" "}
                    <a href="/signup" className="text-blue-500 hover:underline">
                      Sign Up
                    </a>
                  </p>
                </form>
              )}
              {message && (
                <div
                  className={`p-2 rounded-b-lg mt-2 text-center ${
                    message.toLowerCase().includes("error")
                      ? "bg-red-200 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
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