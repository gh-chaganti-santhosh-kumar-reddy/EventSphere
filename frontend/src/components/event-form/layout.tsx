import React from 'react';

export default function EventFormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full py-6 bg-white shadow-md mb-8">
        <h1 className="text-3xl font-bold text-indigo-700 text-center">Create Event</h1>
      </header>
      <div className="max-w-7xl pt-12 mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
