"use client";

import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState<string>("");

  const hasRun = useRef<boolean>(false);

  useEffect(() => {
    if (!token || hasRun.current) return;

    hasRun.current = true; // prevent second run in dev

    axios.get<{ message: string }>(`http://localhost:5274/api/Auth/verify-email?token=${token}`)
      .then(response => { 
        setMessage('User Registered Successfully, now you can Login');
      })
      .catch((error: any) => { 
        setMessage(error.response?.data?.message || error.message);
      });
  }, [token]);

  return (
    <div>
      {message && (
        <div className="p-1 bg-gray-100 text-gray-600 rounded-b">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}