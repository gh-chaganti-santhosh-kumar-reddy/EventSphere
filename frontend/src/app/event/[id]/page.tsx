import React from 'react';
import EventDetail from '../../../components/event-detail';

// Adjust the import path above if your structure is different

async function getEventById(id: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  // Use the correct case for the endpoint: /api/Events/{id}
  const res = await fetch(`${API_URL}/api/Events/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch event');
  return res.json();
}

// Next.js 13+ app directory dynamic route
export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  let event = null;
  try {
    event = await getEventById(id);
  } catch (e) {
    return <div className="text-red-600 font-bold p-8">Event not found or failed to load.</div>;
  }
  return <EventDetail event={event} />;
}
