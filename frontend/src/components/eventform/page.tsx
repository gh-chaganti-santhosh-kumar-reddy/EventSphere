
"use client";
// Always use backend API URL for media files


import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { EditorContent, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Node, mergeAttributes, RawCommands, NodeViewProps } from '@tiptap/core';
import NextImage from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5274";

const Video = Node.create({
  name: 'video',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      width: { default: '100%' },
      height: { default: '240' },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    // Video is a leaf node, do not include a content hole (no '0')
    return ['video', mergeAttributes(HTMLAttributes)];
  },
  addCommands() {
    return {
      insertVideo:
        (attrs: Record<string, any>) =>
        ({ commands }: { commands: RawCommands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
});
import styles from './CreateEventForm.module.css';


import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [eventData, setEventData] = useState({
    title: '',
    organizer: '',
    organizerEmail: '',
    eventStart: '',
    eventEnd: '',
    registrationDeadline: '',
    maxAttendees: '',
    recurrenceType: 'None',
    location: '',
    eventLink: '',
    description: '',
    type: 'Location Based',
    category: 'Music',
    isPaid: false,
    price: '',
    image: null,
    coverImageUrl: '',
    vibeVideo: null,
    vibeVideoPreview: '',
    speakers: [
      { name: '', image: null, imagePreview: '', bio: '' },
    ],
    faqs: [
      { question: '', answer: '' },
    ],
    occurrences: [
      { date: '', startTime: '', endTime: '', location: '' },
    ],
  });
  // Vibe video upload handler
  const handleVibeVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setEventData((prev) => ({ ...prev, vibeVideo: file, vibeVideoPreview: URL.createObjectURL(file) }));
    }
  };
  // FAQ handlers
  const handleFaqChange = (idx: number, field: 'question' | 'answer', value: string) => {
    const faqs = [...eventData.faqs];
    faqs[idx][field] = value;
    setEventData({ ...eventData, faqs });
  };
  const addFaq = () => {
    setEventData({ ...eventData, faqs: [...eventData.faqs, { question: '', answer: '' }] });
  };
  const removeFaq = (idx: number) => {
    const faqs = eventData.faqs.filter((_, i) => i !== idx);
    setEventData({ ...eventData, faqs });
  };



  // Redirect to login if not authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      }
    }
    // Existing style injection code
    const styleId = 'event-description-preview-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .description-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 0.5rem 0;
          box-shadow: 0 2px 8px #0001;
        }
        .description-preview video {
          max-width: 100%;
          border-radius: 8px;
          margin: 0.5rem 0;
          box-shadow: 0 2px 8px #0001;
          background: #000;
        }
        .description-preview p {
          margin: 0.5em 0;
        }
      `;
      document.head.appendChild(style);
    }
  }, [router]);


  // Inject responsive styles for images/videos in description preview
  useEffect(() => {
    const styleId = 'event-description-preview-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .description-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 0.5rem 0;
          box-shadow: 0 2px 8px #0001;
        }
        .description-preview video {
          max-width: 100%;
          border-radius: 8px;
          margin: 0.5rem 0;
          box-shadow: 0 2px 8px #0001;
          background: #000;
        }
        .description-preview p {
          margin: 0.5em 0;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);





  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setEventData({ ...eventData, [name]: checked });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };
  // Image upload handler
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setEventData({ ...eventData, image: file });
      setCoverPreview(URL.createObjectURL(file));
    }
  };


  // Tiptap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      Video,
    ],
    content: eventData.description || '',
    onUpdate: ({ editor }) => {
      setEventData((prev) => ({ ...prev, description: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: 'min-h-[180px] p-2 border rounded bg-white',
      },
    },
    immediatelyRender: false,
  });

  // Only update editor content from eventData.description if editor is NOT focused
  useEffect(() => {
    if (editor && !editor.isFocused && eventData.description !== editor.getHTML()) {
      editor.commands.setContent(eventData.description || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData.description]);

  // Image upload handler for Tiptap (multiple files, append content)
  const handleImageUploadTiptap = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && editor) {
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          editor.chain().focus().insertContent({ type: 'image', attrs: { src: ev.target?.result as string } }).run();
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    }
  }, [editor]);

  // Video upload handler for Tiptap (multiple files, append content)
  const handleVideoUploadTiptap = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && editor) {
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('video/')) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          // @ts-expect-error - Tiptap custom video extension
          editor.chain().focus().insertContent({ type: 'video', attrs: { src: ev.target?.result as string, controls: true, width: '100%', height: '240' } }).run();
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    }
  }, [editor]);

  // Speaker handlers
  const handleSpeakerNameChange = (idx: number, value: string) => {
    const speakers = [...eventData.speakers];
    speakers[idx].name = value;
    setEventData({ ...eventData, speakers });
  };
  const handleSpeakerBioChange = (idx: number, value: string) => {
    const speakers = [...eventData.speakers];
    speakers[idx].bio = value;
    setEventData({ ...eventData, speakers });
  };
  const handleSpeakerImageChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const speakers = [...eventData.speakers];
      speakers[idx].image = file;
      speakers[idx].imagePreview = URL.createObjectURL(file);
      setEventData({ ...eventData, speakers });
    }
  };
  const addSpeaker = () => {
    setEventData({ ...eventData, speakers: [...eventData.speakers, { name: '', image: null, imagePreview: '', bio: '' }] });
  };
  const removeSpeaker = (idx: number) => {
    const speakers = eventData.speakers.filter((_, i) => i !== idx);
    setEventData({ ...eventData, speakers });
  };

  // Submit handler for storing event data in the database

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Debug: Log the data being sent
    console.log('Submitting event with:');
    console.log('Speakers:', eventData.speakers);
    console.log('Faqs:', eventData.faqs);
    console.log('Occurrences:', eventData.occurrences);

    const formData = new FormData();

    // Get OrganizerId from localStorage (adjust key as needed)
    let organizerId = '';
    if (typeof window !== 'undefined') {
      organizerId = localStorage.getItem('userId') || '';
    }

    // Map simple fields (adjust keys to match backend if needed)
    formData.append('Title', eventData.title);
    formData.append('Organizer', eventData.organizer);
    formData.append('OrganizerEmail', eventData.organizerEmail);
    formData.append('EventStart', eventData.eventStart);
    formData.append('EventEnd', eventData.eventEnd);
    formData.append('RegistrationDeadline', eventData.registrationDeadline);
    formData.append('MaxAttendees', eventData.maxAttendees);
    formData.append('RecurrenceType', eventData.recurrenceType);
    formData.append('Location', eventData.location);
    formData.append('EventType', eventData.type);
    formData.append('Category', eventData.category);
    formData.append('Description', eventData.description);
    formData.append('IsPaidEvent', eventData.isPaid ? 'true' : 'false');
    formData.append('Price', eventData.price || '0');
    if (eventData.type === 'Online') {
      formData.append('EventLink', eventData.eventLink);
    }
    // Add OrganizerId if present
    if (organizerId) {
      formData.append('OrganizerId', organizerId);
    }

    // File fields
    if (eventData.image) {
      formData.append('CoverImage', eventData.image);
    }
    if (eventData.vibeVideo) {
      formData.append('VibeVideo', eventData.vibeVideo);
    }

    // Speakers (as JSON, without image files)
    formData.append('Speakers', JSON.stringify(eventData.speakers.map(s => ({
      name: s.name,
      bio: s.bio
    }))));
    formData.append('Faqs', JSON.stringify(eventData.faqs));
    formData.append('Occurrences', JSON.stringify(eventData.occurrences));

    try {
      // Add Authorization header with JWT token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('http://localhost:5274/api/events', {
        method: 'POST',
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });

      if (res.ok) {
        // Expect backend to return event object with coverImageUrl and vibeVideoUrl
        const event = await res.json();
        setEventData(prev => ({
          ...prev,
          coverImageUrl: event.coverImageUrl || '',
          vibeVideoPreview: event.vibeVideoUrl || '',
        }));
        alert('Event submitted successfully!');
        // Optionally reset form or redirect
      } else {
        const error = await res.text();
        alert('Submission failed: ' + error);
      }
    } catch (err) {
      alert('Submission error: ' + err);
    }
  };

  return (
    <div className={styles.container} style={{ minHeight: '100vh', width: '100vw', padding: '2vw', paddingTop: '72px', boxSizing: 'border-box', overflow: 'auto' }}>
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          style={{
            flex: '1 1 400px',
            minWidth: 320,
            maxWidth: 600,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 2px 16px #0001',
            padding: '2rem',
            margin: '0 auto',
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Event Details</h2>
          {/* Title */}
          <label className="block font-medium mb-2">Event Title
            <input name="title" type="text" placeholder="e.g. Summer Fest 2025" required onChange={handleInputChange} className="input input-bordered w-full" />
          </label>

          {/* Cover Image Upload with background preview and overlayed upload button */}
          <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden flex items-center justify-center">
            <NextImage
              src={
                coverPreview
                  ? coverPreview
                  : eventData.coverImageUrl
                  ? `${API_URL}${eventData.coverImageUrl}`
                  : "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=600&q=80"
              }
              alt="Banner Preview"
              className="absolute inset-0 w-full h-full object-cover blur-sm opacity-80"
              style={{ zIndex: 1 }}
              fill
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <label
                className="bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 text-white px-7 py-3 rounded-2xl cursor-pointer shadow-xl hover:from-blue-700 hover:to-cyan-600 transition-all border-2 border-white"
                style={{ minWidth: 220, textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 4px 16px #0002', letterSpacing: 0.5 }}
              >
                <span style={{ pointerEvents: 'none', textShadow: '0 1px 4px #0006' }}>Upload Event Banner</span>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-white mt-2">Recommended: 1200x400px</span>
            </div>
          </div>
          {/* Vibe Video Upload */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Vibe Video (optional)
              <input name="vibeVideo" type="file" accept="video/*" className="input input-bordered w-full" onChange={handleVibeVideoUpload} />
            </label>
            <span className="text-xs text-gray-500">Upload a short video to showcase the vibe of your event.</span>
          </div>

          {/* Organizer */}
          <label className="block font-medium mb-2">Organizer
            <input name="organizer" type="text" placeholder="Your name or organization" required onChange={handleInputChange} className="input input-bordered w-full" />
          </label>
          {/* Organizer Email */}
          <label className="block font-medium mb-2">Organizer Email
            <input name="organizerEmail" type="email" placeholder="e.g. you@email.com" onChange={handleInputChange} className="input input-bordered w-full" style={{ border: '1.5px solid #e5e7eb', background: '#fff', borderRadius: 8, fontSize: 16, padding: '0.75rem' }} />
          </label>

          {/* Event Start & End Date & Time in same row */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <label className="block font-medium mb-2" style={{ flex: 1 }}>
              Event Start Date & Time
              <input name="eventStart" type="datetime-local" required onChange={handleInputChange} value={eventData.eventStart} className="input input-bordered w-full" />
            </label>
            <label className="block font-medium mb-2" style={{ flex: 1 }}>
              Event End Date & Time
              <input name="eventEnd" type="datetime-local" required onChange={handleInputChange} value={eventData.eventEnd} className="input input-bordered w-full" />
            </label>
          </div>
          {/* Recurrence Type */}
          <label className="block font-medium mb-2">Recurrence Type
            <select name="recurrenceType" onChange={handleInputChange} value={eventData.recurrenceType} className="input input-bordered w-full">
              <option value="None">None</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Custom">Custom</option>
            </select>
          </label>

          {/* Location with event type options and conditional map or event link */}
          <div className="mb-2">
            <label className="block font-medium mb-2">Event Type</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              {['Location Based', 'Online', 'To Be Announced'].map((type) => (
                <label
                  key={type}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 8,
                    border: eventData.type === type ? '2px solid #2563eb' : '2px solid #e5e7eb',
                    background: eventData.type === type ? '#2563eb' : '#f3f4f6',
                    color: eventData.type === type ? '#fff' : '#222',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    padding: '0.5rem 0',
                    cursor: 'pointer',
                    boxShadow: eventData.type === type ? '0 2px 8px #2563eb22' : 'none',
                    transition: 'all 0.15s',
                  }}
                  className="select-none"
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={eventData.type === type}
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                  />
                  {type}
                </label>
              ))}
            </div>
            {eventData.type === 'Location Based' && (
              <>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input name="location" type="text" placeholder="e.g. Gachibowli, Hyderabad" required onChange={handleInputChange} value={eventData.location} className="input input-bordered w-full" />
                </div>
                {eventData.location && (
                  <div style={{ marginTop: '0.5rem', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
                    <iframe
                      title="Google Maps Preview"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(eventData.location)}&output=embed`}
                    ></iframe>
                  </div>
                )}
              </>
            )}
            {eventData.type === 'Online' && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: 8 }}>
                <input
                  name="eventLink"
                  type="url"
                  placeholder="Enter event link (e.g. https://meet.example.com/xyz)"
                  required={eventData.type === 'Online'}
                  onChange={handleInputChange}
                  value={eventData.eventLink}
                  className="input input-bordered w-full"
                  style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 16, padding: '0.75rem' }}
                />
              </div>
            )}
          </div>

          {/* Category */}
          <label className="block font-medium mb-2">Category
            <select name="category" onChange={handleInputChange} className="input input-bordered w-full">
              <option value="Music">Music</option>
              <option value="Tech">Tech</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Business">Business</option>
              <option value="Conference">Conference</option>
              <option value="Exhibitions">Exhibitions</option>
              <option value="Others">Others</option>
            </select>
          </label>

          {/* Paid Event - Modern Toggle UI */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 8 }}>
              <span style={{ fontWeight: 500, fontSize: 16 }}>Ticket Type:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: !eventData.isPaid ? '#22c55e' : '#888', fontWeight: !eventData.isPaid ? 700 : 500, fontSize: 16, minWidth: 40, textAlign: 'right' }}>Free</span>
                <button
                  type="button"
                  aria-label="Toggle Paid Event"
                  onClick={() => setEventData({ ...eventData, isPaid: !eventData.isPaid, price: !eventData.isPaid ? eventData.price : '' })}
                  style={{
                    width: 54,
                    height: 18,
                    borderRadius: 10,
                    background: eventData.isPaid ? '#f59e42' : '#22c55e',
                    border: 'none',
                    position: 'relative',
                    transition: 'background 0.2s',
                    boxShadow: '0 1px 4px #0001',
                    outline: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: eventData.isPaid ? 28 : 4,
                    //   top: 4,
                      width: 20,
                      height: 14,
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 1px 4px #0002',
                      transition: 'left 0.2s',
                      display: 'block',
                    }}
                  />
                </button>
                <span style={{ color: eventData.isPaid ? '#f59e42' : '#888', fontWeight: eventData.isPaid ? 700 : 500, fontSize: 16, minWidth: 40, textAlign: 'left' }}>Paid</span>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              {eventData.isPaid && (
                <>
                  <label className="block font-medium mb-2" style={{ marginBottom: 4 }}>Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    placeholder="e.g. 500"
                    required={eventData.isPaid}
                    onChange={handleInputChange}
                    value={eventData.price}
                    className="input input-bordered w-full"
                    style={{ borderColor: '#f59e42', background: '#fff7ed', color: '#b45309', fontWeight: 600 }}
                  />
                </>
              )}
              {/* Max Attendees */}
              <label className="block font-medium mb-2 mt-4">Max People Can Attend
                <input
                  name="maxAttendees"
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  onChange={handleInputChange}
                  value={eventData.maxAttendees}
                  className="input input-bordered w-full"
                />
              </label>
              {/* Registration Deadline (always visible) */}
              <label className="block font-medium mb-2 mt-4">Registration Deadline
                <input
                  name="registrationDeadline"
                  type="datetime-local"
                  onChange={handleInputChange}
                  value={eventData.registrationDeadline}
                  className="input input-bordered w-full"
                />
              </label>
            </div>
          </div>

          {/* Description with Tiptap Rich Text Editor, image and video upload buttons at bottom corners */}
          <label className="block font-medium mb-2">Event Description</label>
          <div className="mb-4">
            {/* Editor box only */}
            <div style={{ border: '1.5px solid #e5e7eb', borderRadius: 12, background: '#fff', minHeight: 180, marginBottom: 0 }}>
              <EditorContent editor={editor} />
            </div>
            {/* Upload buttons below, side by side */}
            <div style={{ display: 'flex', gap: 0, marginTop: 8 }}>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f3f4f6', borderRadius: '0 0 0 12px', padding: '0.75rem 0', fontWeight: 600, fontSize: 16, boxShadow: '0 1px 4px #0001', border: '1.5px solid #e5e7eb', borderTop: 'none', borderRight: '0.75px solid #e5e7eb' }}>
                🖼 Image
                <input type="file" accept="image/*" multiple onChange={handleImageUploadTiptap} className="hidden" />
              </label>
              <label style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#f3f4f6', borderRadius: '0 0 12px 0', padding: '0.75rem 0', fontWeight: 600, fontSize: 16, boxShadow: '0 1px 4px #0001', border: '1.5px solid #e5e7eb', borderTop: 'none', borderLeft: '0.75px solid #e5e7eb' }}>
                🎬 Video
                <input type="file" accept="video/*" multiple onChange={handleVideoUploadTiptap} className="hidden" />
              </label>
            </div>
          </div>

          {/* Speakers */}
          <div>
            <label className="block font-medium mb-2">Speakers</label>
            {eventData.speakers.map((speaker, idx) => (
              <div key={idx} style={{
                position: 'relative',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 10,
                  padding: '0.75rem 0.75rem 0.75rem 0.75rem',
                  background: '#f8fafc',
                  boxShadow: '0 1px 4px #0001',
                  flex: 1,
                  position: 'relative',
                  minHeight: 90,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <button
                    type="button"
                    onClick={() => removeSpeaker(idx)}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: '#fff',
                      border: '1.5px solid #222',
                      borderRadius: '50%',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px #0002',
                      zIndex: 2,
                      transition: 'background 0.15s',
                      padding: 0,
                    }}
                    title="Delete speaker"
                    aria-label="Delete speaker"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start', marginBottom: 6, width: '100%' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                      {speaker.imagePreview ? (
                        <img src={speaker.imagePreview} alt={`Speaker ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ color: '#888', fontSize: 22 }}>👤</span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Speaker Name"
                      value={speaker.name}
                      onChange={e => handleSpeakerNameChange(idx, e.target.value)}
                      className="input input-bordered"
                      style={{ fontSize: 13, height: 28, padding: '2px 8px', borderRadius: 6, marginBottom: 2, width: '100%' }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleSpeakerImageChange(idx, e)}
                      className="input input-bordered"
                      style={{ fontSize: 12, height: 26, padding: '2px 8px', borderRadius: 6, background: '#fff', width: '100%' }}
                    />
                  </div>
                  <textarea
                    placeholder="Speaker Bio"
                    value={speaker.bio}
                    onChange={e => handleSpeakerBioChange(idx, e.target.value)}
                    className="input input-bordered"
                    style={{ minHeight: 36, fontSize: 13, resize: 'vertical', padding: '4px 8px', borderRadius: 6 }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpeaker}
              className="mt-4 px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition-all w-full"
              style={{ fontSize: '1rem', border: 'none', letterSpacing: 0.5 }}
            >
              + Add another speaker
            </button>
          </div>

          {/* FAQs Section */}
          <div style={{ margin: '2rem 0' }}>
            <label className="block font-medium mb-2">Event FAQs</label>
            {eventData.faqs.map((faq, idx) => (
              <div key={idx} style={{
                position: 'relative',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  border: '1.5px solid #e5e7eb',
                  borderRadius: 10,
                  padding: '0.75rem 0.75rem 0.75rem 0.75rem',
                  background: '#f8fafc',
                  boxShadow: '0 1px 4px #0001',
                  flex: 1,
                  position: 'relative',
                  minHeight: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <button
                    type="button"
                    onClick={() => removeFaq(idx)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 8,
                      background: '#fff',
                      border: '1.5px solid #222',
                      borderRadius: '50%',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px #0002',
                      zIndex: 2,
                      transition: 'background 0.15s',
                      padding: 0,
                    }}
                    title="Delete FAQ"
                    aria-label="Delete FAQ"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                  <input
                    type="text"
                    placeholder={`Question ${idx + 1}`}
                    value={faq.question}
                    onChange={e => handleFaqChange(idx, 'question', e.target.value)}
                    className="input input-bordered"
                    style={{ fontSize: 13, height: 28, padding: '2px 8px', borderRadius: 6, marginBottom: 4 }}
                  />
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={e => handleFaqChange(idx, 'answer', e.target.value)}
                    className="input input-bordered"
                    style={{ minHeight: 28, fontSize: 13, resize: 'vertical', padding: '4px 8px', borderRadius: 6 }}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addFaq}
              className="mt-2 px-5 py-2 rounded-xl bg-sky-600 text-white font-semibold shadow hover:bg-sky-700 transition-all w-full"
              style={{ fontSize: '1rem', border: 'none', letterSpacing: 0.5 }}
            >
              + Add another FAQ
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-5 py-3 rounded-xl bg-green-600 text-white font-bold shadow hover:bg-green-700 transition-all text-lg"
            style={{ fontSize: '1.1rem', border: 'none', letterSpacing: 0.5 }}
          >
            Publish Event
          </button>
          {/* FAQs Preview */}
          <div style={{ margin: '1.5rem 0' }}>
            <strong style={{ fontSize: '1.1rem', color: '#222' }}>FAQs:</strong>
            {eventData.faqs.length === 0 || eventData.faqs.every(f => !f.question && !f.answer) ? (
              <span style={{ color: '#888', marginLeft: 8 }}>[No FAQs added]</span>
            ) : (
              <div style={{ marginTop: 8 }}>
                {eventData.faqs.map((faq, idx) => (
                  (faq.question || faq.answer) && (
                    <div key={idx} style={{ marginBottom: 16, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: 12 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, color: '#2563eb' }}>Q{idx + 1}: {faq.question || <span style={{ color: '#aaa' }}>[Question]</span>}</div>
                      <div style={{ fontSize: 14, color: '#444', marginTop: 4, paddingLeft: 8 }}>A: {faq.answer || <span style={{ color: '#bbb' }}>[Answer]</span>}</div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Live Preview */}
        <div
          className={styles.preview}
          style={{
            flex: '1 1 400px',
            minWidth: 320,
            maxWidth: 600,
            background: '#f9fafb',
            borderRadius: 16,
            boxShadow: '0 2px 16px #0001',
            padding: '2rem',
            margin: '0 auto',
            minHeight: 600,
            overflow: 'auto',
          }}
        >
          <h2>📌 Live Preview</h2>
          <p><strong>Title:</strong> {eventData.title || '[Event Title]'}</p>
          {/* Banner Image Label above Preview */}
          <div style={{ fontSize: '1.1rem', color: '#222', fontWeight: 700, marginTop: '1.5rem', marginBottom: 4 }}>
            Event Cover Image
          </div>
          <NextImage
            src={coverPreview || (eventData.coverImageUrl ? `${API_URL}${eventData.coverImageUrl}` : "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=600&q=80")}
            alt="Preview"
            className={styles.previewImage}
            style={{ margin: '0 0 0.5rem 0', borderRadius: 8, width: '100%', maxHeight: 200, objectFit: 'cover' }}
            width={600}
            height={200}
            priority
          />
          {/* Vibe Video Label and Preview below Banner */}
          {eventData.vibeVideoPreview && (
            <div style={{ margin: '0.5rem 0 1rem 0' }}>
              <div style={{ fontSize: '1.1rem', color: '#222', fontWeight: 700, marginBottom: 4 }}>
                Vibe Video
              </div>
              <video src={eventData.vibeVideoPreview.startsWith('blob:') ? eventData.vibeVideoPreview : `${API_URL}${eventData.vibeVideoPreview}`} controls style={{ width: '100%', maxHeight: 240, borderRadius: 8, background: '#000' }} />
            </div>
          )}
          <p><strong>Organizer:</strong> {eventData.organizer || '[Organizer]'}</p>
          <p><strong>Organizer Email:</strong> {eventData.organizerEmail || '[Organizer Email]'}</p>
          <p><strong>Event Start:</strong> {eventData.eventStart || '[Start Date & Time]'}</p>
          <p><strong>Event End:</strong> {eventData.eventEnd || '[End Date & Time]'}</p>
          <p><strong>Registration Deadline:</strong> {eventData.registrationDeadline || '[Registration Deadline]'}</p>
          <p><strong>Recurrence Type:</strong> {eventData.recurrenceType || '[Recurrence Type]'}</p>
          <p><strong>Location:</strong> {eventData.type === 'Online' ? (
            eventData.eventLink ? (
              <a href={eventData.eventLink} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>{eventData.eventLink}</a>
            ) : <span style={{ color: '#888' }}>[Event Link]</span>
          ) : (
            eventData.location || '[Location]'
          )}</p>

          {/* Event Link Preview (explicit, for clarity) */}
          {eventData.type === 'Online' && (
            <div style={{ margin: '0.5rem 0 1.5rem 0' }}>
              <strong style={{ fontSize: '1.1rem', color: '#222' }}>Event Link:</strong>
              {eventData.eventLink ? (
                <a href={eventData.eventLink} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', marginLeft: 8 }}>{eventData.eventLink}</a>
              ) : (
                <span style={{ color: '#888', marginLeft: 8 }}>[Event Link]</span>
              )}
            </div>
          )}
          <p><strong>Type:</strong> {eventData.type}</p>
          <p><strong>Category:</strong> {eventData.category}</p>
          <div style={{ margin: '0.5rem 0 1.5rem 0' }}>
            <strong style={{ fontSize: '1.1rem', color: '#222' }}>Ticket Type:</strong>
            {eventData.isPaid ? (
              <span style={{
                display: 'inline-block',
                marginLeft: 10,
                background: '#f59e42',
                color: '#fff',
                borderRadius: 8,
                padding: '2px 14px',
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 0.5,
                boxShadow: '0 1px 4px #f59e4222',
              }}>Paid - ₹{eventData.price || '0'}</span>
            ) : (
              <span style={{
                display: 'inline-block',
                marginLeft: 10,
                background: '#22c55e',
                color: '#fff',
                borderRadius: 8,
                padding: '2px 14px',
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: 0.5,
                boxShadow: '0 1px 4px #22c55e22',
              }}>Free</span>
            )}
            <div style={{ marginTop: 8 }}>
              <strong style={{ fontSize: '1rem', color: '#222' }}>Max People Can Attend:</strong> {eventData.maxAttendees || '[Not set]'}
            </div>
          </div>
          <div style={{ margin: '1.5rem 0' }}>
            <strong style={{ fontSize: '1.1rem', color: '#222' }}>Description:</strong>
            <div
              className="prose prose-lg max-w-none bg-white/80 border border-gray-200 rounded-lg p-4 mt-2 shadow-sm description-preview"
              style={{ minHeight: 80, fontSize: '1.1rem', lineHeight: 1.7, color: '#222' }}
              dangerouslySetInnerHTML={{ __html: eventData.description || '<span style=\"color:#888\">[Description]</span>' }}
            />
          </div>
          <div style={{ margin: '1.5rem 0' }}>
            <strong style={{ fontSize: '1.1rem', color: '#222' }}>Speakers:</strong>
            {eventData.speakers.length === 0 || eventData.speakers.every(s => !s.name && !s.bio && !s.imagePreview) ? (
              <span style={{ color: '#888', marginLeft: 8 }}>[No speakers added]</span>
            ) : (
              <div style={{ marginTop: 8 }}>
                {eventData.speakers.map((speaker, idx) => (
                  (speaker.name || speaker.bio || speaker.imagePreview) && (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {speaker.imagePreview ? (
                          <img src={speaker.imagePreview} alt={`Speaker ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : speaker.photoUrl ? (
                          <img src={`${API_URL}${speaker.photoUrl}`} alt={`Speaker ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ color: '#888', fontSize: 24 }}>👤</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{speaker.name || <span style={{ color: '#aaa' }}>[Name]</span>}</div>
                        <div style={{ fontSize: 14, color: '#444', marginTop: 4 }}>{speaker.bio || <span style={{ color: '#bbb' }}>[Bio]</span>}</div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* FAQs Preview in Live Preview */}
          <div style={{ margin: '1.5rem 0' }}>
            <strong style={{ fontSize: '1.1rem', color: '#222' }}>FAQs:</strong>
            {eventData.faqs.length === 0 || eventData.faqs.every(f => !f.question && !f.answer) ? (
              <span style={{ color: '#888', marginLeft: 8 }}>[No FAQs added]</span>
            ) : (
              <div style={{ marginTop: 8 }}>
                {eventData.faqs.map((faq, idx) => (
                  (faq.question || faq.answer) && (
                    <div key={idx} style={{ marginBottom: 16, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001', padding: 12 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, color: '#2563eb' }}>Q{idx + 1}: {faq.question || <span style={{ color: '#aaa' }}>[Question]</span>}</div>
                      <div style={{ fontSize: 14, color: '#444', marginTop: 4, paddingLeft: 8 }}>A: {faq.answer || <span style={{ color: '#bbb' }}>[Answer]</span>}</div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Vibe Video Preview (from backend after creation) */}
          {eventData.vibeVideoPreview && (
            <div style={{ margin: '1.5rem 0' }}>
              <strong style={{ fontSize: '1.1rem', color: '#222' }}>Vibe Video:</strong>
              <video src={eventData.vibeVideoPreview.startsWith('blob:') ? eventData.vibeVideoPreview : `${API_URL}${eventData.vibeVideoPreview}`} controls style={{ width: '100%', maxWidth: 400, marginTop: 8, borderRadius: 8 }} />
            </div>
          )}
          {/* ...moved above, right after title... */}
        </div>
      </div>
    </div>
  );
}