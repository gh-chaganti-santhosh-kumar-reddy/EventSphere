
"use client";
import React, { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center h-10">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search events, organizers, or categories..."
        className="h-10 px-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        style={{ minWidth: 180 }}
      />
      <button
        type="submit"
        className="h-10 px-4 bg-blue-600 text-white rounded-r-md font-semibold hover:bg-blue-700 transition-colors duration-200"
      >
        Search
      </button>
    </form>
  );
}
