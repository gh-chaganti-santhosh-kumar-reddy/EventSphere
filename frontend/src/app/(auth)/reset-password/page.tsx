"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function PasswordReset() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchError, setMatchError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const encrypted = searchParams.get("token");
      setToken(encrypted);

  }, [searchParams]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setMatchError("Passwords do not match.");
    } else {
      setMatchError("");
    }
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (newPassword !== e.target.value) {
      setMatchError("Passwords do not match.");
    } else {
      setMatchError("");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("Invalid or missing token.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMatchError("Passwords do not match.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5274/api/Auth/reset-password", {
        token,
        newPassword,
      });
      setMessage(res.data.message || "Password reset successful.");
      // Redirect to login after short delay
      setTimeout(() => {
        router.push('/Login');
      }, 2000);
    } catch (err: any) {
      setMessage(
        err.response?.data?.message || "Password reset failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed px-2" style={{ backgroundImage: "url('/images/bg.png')" }}>
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form className="space-y-4" onSubmit={handleResetSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border px-4 py-2 rounded"
            required
            value={newPassword}
            onChange={handlePasswordChange}
          />
          <input
            type="password"
            placeholder="Re-enter new password"
            className="w-full border px-4 py-2 rounded"
            required
            value={confirmPassword}
            onChange={handleConfirmChange}
          />
          {matchError && (
            <p className="text-red-500 text-sm">{matchError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded font-semibold"
            disabled={!!matchError || !newPassword || !confirmPassword}
          >
            Reset Password
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-sm text-gray-700">{message}</div>
        )}
      </div>
    </div>
  );
}
