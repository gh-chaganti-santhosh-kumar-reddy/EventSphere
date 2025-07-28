"use client";

import { useState, useEffect } from "react";
 import { useRef } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_BASE_URL } from '../../../apiConfig';

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState("");

 

const hasRun = useRef(false);

useEffect(() => {
  if (!token || hasRun.current) return;

  hasRun.current = true; // prevent second run in dev

  axios.get(`${API_BASE_URL}/Auth/verify-email?token=${token}`)
    .then(response => { 
      // Redirect to login with success message
      router.replace('/login?verified=1');
    })
    .catch(error => { 
      setMessage(error.response?.data?.message || error.message);
      router.replace('/verify_email'); // Remove token from URL
    });
}, [token, router]);


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