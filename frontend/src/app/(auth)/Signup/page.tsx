"use client";
import { Roboto } from "next/font/google";
const roboto = Roboto({ subsets: ["latin"], weight: "700" });

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[\W]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (value: number) => {
    switch (value) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
      case 3:
        return "bg-yellow-400";
      case 4:
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { name, email, password } = formData;
      const res = await axios.post("http://localhost:5274/api/Auth/register", {
        name,
        email,
        password
      });
      setMessage("Signup successful! Please check your email.");
      setSuccess(true);
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Something went wrong.";
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed flex flex-col select-none" style={{ backgroundImage: "url('/images/bg.png')" }}>
      <div className="flex justify-center px-2 sm:px-4 py-8 md:min-h-screen md:items-center">
        <div className="bg-white/30 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl flex flex-col md:flex-row w-full max-w-md sm:max-w-lg md:max-w-3xl overflow-hidden">
          {/* Left: Image and Welcome - now always visible and stacked on top for mobile */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-white/40 p-6 relative overflow-visible md:order-none order-first">
            {/* Glowing animated frame */}
            <Image
              src="/images/register.png"
              alt="Event Sphere"
              width={120}
              height={120}
              className="relative z-20 object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105 mb-2 md:mb-0"
              loading="lazy"
            />
            <div className="text-xl md:text-2xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 drop-shadow-lg mb-1 md:mb-2">
              Welcome to Event Sphere
            </div>
            <div className="text-center text-blue-900/80 font-medium text-sm md:text-base italic mb-2 md:mb-0">
              Join us and experience the future of event management!
            </div>
          </div>
          {/* Signup Form */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl mb-4 font-bold text-blue-900 text-center">
              Signup
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                required
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                {isPasswordFocused && formData.password && (
                  <div className="w-full h-1 mt-1 bg-gray-200 rounded">
                    <div
                      className={`h-full rounded ${getStrengthColor(strength)}`}
                      style={{ width: `${(strength / 5) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full border px-3 py-2 rounded text-sm sm:text-base"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="w-full text-white py-2 rounded font-semibold bg-cyan-500 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:scale-105 hover:shadow-lg transition-all duration-200 text-base sm:text-lg"
                style={{ background: "rgba(4, 195, 216, 1)" }}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
              <p className="text-xs sm:text-sm text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </p>
            </form>
            {message && (
              <div
                className={`mt-4 text-xs sm:text-sm p-2 rounded ${
                  success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
