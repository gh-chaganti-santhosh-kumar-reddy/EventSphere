"use client";
// Ensure bullet/number markers always show in description preview
if (typeof window !== 'undefined') {
  const styleId = 'force-bullets-style';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      /* Preview/editor area bullets: marker and text on same line */
      .description-preview ul, .tiptap-content ul {
        list-style-type: disc !important;
        list-style-position: outside !important;
        margin-left: 1.5em !important;
        padding-left: 0 !important;
      }
      .description-preview ul li, .tiptap-content ul li {
        list-style-type: disc !important;
        display: list-item !important;
        margin-left: 0 !important;
        padding-left: 0.3em !important;
        font-size: 1em;
        line-height: 1.7;
      }
      .description-preview ol, .tiptap-content ol {
        list-style-type: decimal !important;
        list-style-position: outside !important;
        margin-left: 1.5em !important;
        padding-left: 0 !important;
      }
      .description-preview ol li, .tiptap-content ol li {
        list-style-type: decimal !important;
        display: list-item !important;
        margin-left: 0 !important;
        padding-left: 0.3em !important;
        font-size: 1em;
        line-height: 1.7;
      }
    `;
    document.head.appendChild(style);
  }
}

// Always use backend API URL for media files


import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { EditorContent, useEditor, Editor } from '@tiptap/react';

// Add a class to the Tiptap editor content for bullet styling
// This ensures the injected CSS above applies to the editor area
const tiptapContentClass = 'tiptap-content';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Node, mergeAttributes, RawCommands, NodeViewProps } from '@tiptap/core';
import NextImage from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5274";

// Pencil SVG as data URI for cursor
const pencilCursor =
  "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><g><polygon points=\"2,30 8,28 26,10 22,6 4,24\" fill=\"%23fbbf24\" stroke=\"%233b2f13\" stroke-width=\"2\"/><rect x=\"22\" y=\"6\" width=\"4\" height=\"4\" fill=\"%23a3a3a3\" stroke=\"%233b2f13\" stroke-width=\"2\"/><polygon points=\"2,30 8,28 4,24\" fill=\"%23fff\" stroke=\"%233b2f13\" stroke-width=\"1\"/></g></svg>') 0 32, auto";

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
    } as any;
  },
});

// import '../app/globals.css'

import { useRouter } from 'next/navigation';

type Speaker = { name: string; image: File | null; imagePreview: string; bio: string; photoUrl?: string };
type Faq = { question: string; answer: string };
type Occurrence = { date: string; startTime: string; endTime: string; location: string };

type EventData = {
  title: string;
  OrganizerName: string;
  organizerEmail: string;
  eventStart: string;
  eventEnd: string;
  registrationDeadline: string;
  maxAttendees: string;
  recurrenceType: string;
  location: string;
  eventLink: string;
  description: string;
  type: string;
  category: string;
  isPaid: boolean;
  price: string;
  image: File | null;
  coverImageUrl: string;
  vibeVideo: File | null;
  vibeVideoPreview: string;
  speakers: Speaker[];
  faqs: Faq[];
  occurrences: Occurrence[];
  recurrenceRule: string;
  customDates: string[];
};

export default function CreateEventPage() {
  // Handler for vibe video upload
  const handleVibeVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setEventData(prev => ({
        ...prev,
        vibeVideo: file,
        vibeVideoPreview: URL.createObjectURL(file),
      }));
    }
  };
  // State for event data, recurrence, and organizer
  const [eventData, setEventData] = useState<any>({
    title: '',
    OrganizerName: '', // For backend compatibility
    organizer: '', // For frontend display (optional)
    organizerEmail: '',
    eventStart: '',
    eventEnd: '',
    registrationDeadline: '',
    maxAttendees: '',
    recurrenceType: 'None',
    recurrenceRule: '',
    customDates: [],
    customFields: '',
    location: '',
    eventLink: '',
    description: '',
    type: 'Location Based',
    category: '',
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
    occurrences: [],
  });
  // State to control live preview visibility on mobile
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const router = useRouter();
  const [coverPreview, setCoverPreview] = useState<string>("");
  // Add showRibbons state
const [showRibbons, setShowRibbons] = useState(false);

// Responsive styles for images/videos in description preview
"use client";
  // ...existing code...

  // ...existing code...






  // Input change handler with recurrence logic
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEventData({ ...eventData, [name]: checked });
    } else {
      // Special logic for recurrenceType
      if (name === 'recurrenceType') {
        setEventData({
          ...eventData,
          recurrenceType: value,
          recurrenceRule: value === 'rule' ? eventData.recurrenceRule : '',
          customDates: value === 'custom' ? eventData.customDates || [] : [],
          customFields: value === 'custom' ? JSON.stringify(eventData.customDates || []) : '',
        });
      } else {
        setEventData({ ...eventData, [name]: value });
      }
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


  const editor = useEditor({
  extensions: [
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
    Image,
    Link,
    Video,
  ],
  content: eventData.description || '',
  onUpdate: ({ editor }) => {
    setEventData((prev) => ({ ...prev, description: editor.getHTML() }))
  },
  editorProps: {
    attributes: {
      class: 'min-h-[180px] p-4 border rounded bg-white list-disc pl-6 prose prose-sm max-w-none',
    },
  },
  immediatelyRender: false,
})


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

  // FAQ handlers
  const addFaq = () => {
    setEventData(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '', answer: '' }]
    }));
  };
  const removeFaq = (idx: number) => {
    setEventData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== idx)
    }));
  };
  const handleFaqChange = (idx: number, field: 'question' | 'answer', value: string) => {
    setEventData(prev => {
      const newFaqs = [...prev.faqs];
      newFaqs[idx][field] = value;
      return { ...prev, faqs: newFaqs };
    });
  };

  // Submit handler for storing event data in the database
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Ensure OrganizerName is present and non-empty
    if (!eventData.OrganizerName || eventData.OrganizerName.trim() === "") {
      alert("Organizer name is required.");
      return;
    }
    // Fallback: If OrganizerName is somehow null, set to 'Unknown Organizer'
    if (eventData.OrganizerName == null) {
      eventData.OrganizerName = "Unknown Organizer";
    }

    // Show ribbons for 3 seconds
    setShowRibbons(true);
    setTimeout(() => setShowRibbons(false), 3000);

    // Debug: Log the data being sent
    console.log('Submitting event with:');
    console.log('Speakers:', eventData.speakers);
    console.log('Faqs:', eventData.faqs);
    console.log('Occurrences:', eventData.occurrences);

    // Build validOccurrences and RecurrenceRule/CustomFields for backend
    let validOccurrences = [];
    let recurrenceRule = '';
    let customFields = '';

    // Debug: Log customDates and validOccurrences before sending
    console.log('DEBUG customDates:', eventData.customDates);
    // validOccurrences will be set below, so log after it's set
    if (eventData.recurrenceType === 'None') {
      // Single event: one occurrence from eventStart/eventEnd
      if (!eventData.eventStart || !eventData.eventEnd) {
        alert('Event start and end are required.');
        return;
      }
      const start = new Date(eventData.eventStart);
      const end = new Date(eventData.eventEnd);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        alert('Invalid event start or end date/time.');
        return;
      }
      if (end <= start) {
        alert('Event end must be after start.');
        return;
      }
      validOccurrences = [{
        date: eventData.eventStart.split('T')[0],
        startTime: eventData.eventStart.split('T')[1],
        endTime: eventData.eventEnd.split('T')[1],
        location: eventData.location || '',
      }];
    } else if (eventData.recurrenceType === 'rule') {
      // Rule-based recurrence: send rule, no occurrences
      if (!eventData.recurrenceRule) {
        alert('Recurrence rule is required.');
        return;
      }
      recurrenceRule = eventData.recurrenceRule;
      validOccurrences = [];
    } else if (eventData.recurrenceType === 'custom') {
  // Custom dates: build occurrences from customDates (array of {start, end})
  if (!eventData.customDates || eventData.customDates.length === 0) {
    alert('At least one custom occurrence is required.');
    return;
  }
  // Validate all custom occurrences have both start and end
  for (const occ of eventData.customDates) {
    if (!occ.start || !occ.end) {
      alert('Each custom occurrence must have both start and end date/time.');
      return;
    }
    // Ensure the value is a valid ISO string with date and time
    const startDate = new Date(occ.start);
    const endDate = new Date(occ.end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert('Invalid date/time format in custom occurrence.');
      return;
    }
    if (endDate <= startDate) {
      alert('Custom occurrence end must be after start.');
      return;
    }
  }
  // Always send ISO string (date and time) to backend
  validOccurrences = eventData.customDates.map((occ: any) => ({
    StartTime: new Date(occ.start).toISOString(),
    EndTime: new Date(occ.end).toISOString(),
    EventTitle: eventData.title
  }));
  // Also update customFields to use ISO strings
  customFields = JSON.stringify(eventData.customDates.map((occ: any) => ({
    start: new Date(occ.start).toISOString(),
    end: new Date(occ.end).toISOString()
  })));
  // Log validOccurrences after mapping
  console.log('DEBUG validOccurrences:', validOccurrences);
}

    const formData = new FormData();

    // Get OrganizerId from localStorage (adjust key as needed)
    let organizerId = '';
    if (typeof window !== 'undefined') {
      organizerId = localStorage.getItem('userId') || '';
    }

    // Map simple fields (adjust keys to match backend if needed)
    formData.append('Title', eventData.title);
    formData.append('OrganizerName', eventData.OrganizerName && eventData.OrganizerName.trim() ? eventData.OrganizerName.trim() : "Unknown Organizer");
    formData.append('OrganizerEmail', eventData.organizerEmail);
    formData.append('EventStart', eventData.eventStart);
    formData.append('EventEnd', eventData.eventEnd);
    formData.append('RegistrationDeadline', eventData.registrationDeadline);
    formData.append('MaxAttendees', eventData.maxAttendees);
    formData.append('RecurrenceType', eventData.recurrenceType);
    if (eventData.recurrenceType === 'rule') {
      formData.append('RecurrenceRule', recurrenceRule);
    }
    if (eventData.recurrenceType === 'custom') {
      formData.append('CustomFields', customFields);
    }
    formData.append('Location', eventData.location);
    formData.append('EventType', eventData.type);
    formData.append('Category', eventData.category);

    // --- Extract and upload images from description ---
    // --- Extract and upload images/videos from description ---
    const descriptionHtml = eventData.description;
    const mediaRegex = /<img[^>]+src=["'](data:image\/(png|jpeg|jpg|gif);base64,[^"']+)["'][^>]*>|<video[^>]+src=["'](data:video\/(mp4|webm|mov|avi|mkv);base64,[^"']+)["'][^>]*>/gi;
    let match: RegExpExecArray | null;
    let imgIndex = 0;
    let newDescription = descriptionHtml;
    while ((match = mediaRegex.exec(descriptionHtml)) !== null) {
      // match[1] is image, match[2] is video
      const dataUrl = match[1] || match[2];
      if (!dataUrl) continue;
      const arr = dataUrl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) continue;
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);
      for (let i = 0; i < n; ++i) u8arr[i] = bstr.charCodeAt(i);
      const ext = mime.split('/')[1];
      const file = new File([u8arr], `descmedia_${Date.now()}_${imgIndex}.${ext}`, { type: mime });
      formData.append('media', file);
      // Log file info for debugging
      console.log(`[MEDIA APPEND] name: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
      // Replace src with placeholder
      newDescription = newDescription.replace(dataUrl, `__MEDIA_${imgIndex}__`);
      imgIndex++;
    }

    // Extract all video URLs from the description and add to mediaDtos
    const videoUrlRegex = /https?:\/\/[^\s'"<>]+\.(mp4|webm|mov|avi|mkv)/gi;
    let videoUrlMatch;
    const mediaDtos = [];
    while ((videoUrlMatch = videoUrlRegex.exec(descriptionHtml)) !== null) {
      const url = videoUrlMatch[0];
      mediaDtos.push({
        MediaType: 'Video',
        MediaUrl: url,
        Description: 'Extracted from description'
      });
    }
    if (mediaDtos.length > 0) {
      formData.append('Media', JSON.stringify(mediaDtos));
    }
    formData.append('Description', newDescription);

    formData.append('IsPaidEvent', eventData.isPaid ? 'true' : 'false');
    formData.append('Price', eventData.price || '0');
    // Always send EventLink, even if empty
    formData.append('EventLink', eventData.eventLink || '');
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
      bio: s.bio,
      photoUrl: s.photoUrl || undefined
    }))));
    // Attach speaker images as separate fields
    eventData.speakers.forEach((speaker, idx) => {
      if (speaker.image) {
        formData.append(`speakers[${idx}].image`, speaker.image);
      }
    });
    // Ensure Faqs is always an array
    const faqsArray = Array.isArray(eventData.faqs) ? eventData.faqs : [eventData.faqs];
    formData.append('Faqs', JSON.stringify(faqsArray));
    formData.append('Occurrences', JSON.stringify(validOccurrences));
    // Remove duplicate OrganizerName append and validation block (already handled above)

    try {
      // Add Authorization header with JWT token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('http://localhost:5274/api/events', {
        method: 'POST',
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });

      if (res.ok) {
        // Expect backend to return event object with coverImageUrl, vibeVideoUrl, and mediaUrls (array of uploaded image/video URLs in order)
        const event = await res.json();
        // If backend returns mediaUrls, replace placeholders in description
        if (event.mediaUrls && Array.isArray(event.mediaUrls)) {
          let updatedDescription = newDescription;
          event.mediaUrls.forEach((url: string, idx: number) => {
            updatedDescription = updatedDescription.replace(`__MEDIA_${idx}__`, url);
          });
          // Optionally, update the event description in the backend with the cleaned version (if needed)
          // You may want to send a PATCH/PUT here if backend doesn't already store the cleaned version
          // For now, just update the local state
          setEventData(prev => ({
            ...prev,
            description: updatedDescription,
            coverImageUrl: event.coverImageUrl || '',
            vibeVideoPreview: event.vibeVideoUrl || '',
          }));
        } else {
          setEventData(prev => ({
            ...prev,
            coverImageUrl: event.coverImageUrl || '',
            vibeVideoPreview: event.vibeVideoUrl || '',
          }));
        }
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
    <div
      className="bg-violet-50 rounded-2xl shadow-lg p-2 sm:p-4 md:p-8 md:py-8 md:px-8 min-h-screen w-full box-border overflow-auto relative select-none mt-0"

      style={{ cursor: pencilCursor }}
    >
      <div className="absolute left-[-10px] top-4 sm:left-[-14px] sm:top-6 flex flex-col gap-2 sm:gap-3 z-10"> {Array.from({length: 9}).map((_, i)=> (
        <div key={i} className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-700 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
      ))}
      </div>
      {/* Mobile: Toggle Live Preview Button */}
      <div className="block lg:hidden w-full mb-3">
        <button
          type="button"
          className="w-full py-2 px-4 rounded-xl bg-orange-500 text-white font-bold shadow hover:bg-orange-600 transition-all text-base md:text-lg border-0 tracking-wide"
          onClick={() => setShowMobilePreview((prev) => !prev)}
        >
          {showMobilePreview ? 'Hide Live Preview' : 'Show Live Preview'}
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full max-w-full md:max-w-[1400px] mx-auto items-start relative">
        {/* Create Event Form */}
        <form
          className={`relative flex flex-col gap-4 md:gap-5 flex-1 min-w-0 w-full max-w-full md:min-w-[320px] md:max-w-[600px] bg-white rounded-2xl shadow-lg p-3 sm:p-6 md:p-8 m-auto ring-2 md:ring-4 ring-violet-200/40 drop-shadow-[0_0_24px_rgba(139,92,246,0.25)] overflow-y-auto font-italic italic ${showMobilePreview ? 'hidden' : ''} lg:block`}
          onSubmit={handleSubmit}
          style={{
            maxHeight: '1000px', // match preview if needed
            height: '100%',
            marginTop: 0, // <-- remove vertical margin
            marginBottom: 0,
          }}
        >
          <div className="flex flex-row items-center mb-3 md:mb-4">
            <img
              src="/images/siderib.png"
              alt="Sidebar Decorative"
              className="hidden md:block h-12 md:h-20 w-auto -ml-4 md:-ml-10 mr-2 md:mr-5 select-none pointer-events-none"
            />
            <h2 className="text-lg md:text-2xl font-bold text-center">Create an Event</h2>
          </div>
          <p className="italic text-sm md:text-base">Enter Event Details below:</p>
          {/* Title */}
          <label className="font-medium text-gray-600 flex flex-col gap-1 mb-2 italic text-sm md:text-base">
  <span className="flex items-center">
    Event Title
    <span className="text-red-500 ml-1">*</span>
  </span>
  <div className="relative">
    <input
      name="title"
      type="text"
      placeholder="e.g. Summer Fest 2025"
      required
      onChange={handleInputChange}
      value={eventData.title}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition duration-200 pr-10 font-normal not-italic"
    />
    {eventData.title && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </span>
    )}
  </div>
</label>
  {/* Upload Event Banner label and upload button after Event Title */}
  <div className="flex flex-col items-start w-full mb-2 text-sm md:text-base">
    <div className="mb-2 flex items-center">
      <span className="text-gray-700 font-medium text-base italic">Upload Event Banner</span>
      <span className="text-red-400 ml-1 text-lg">*</span>
    </div>
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
    <span className="text-xs text-gray-500 mt-2">Recommended: 1200x400px</span>
  </div>
          {/* Cover Image Preview (remains after the input) */}
          <div className="relative h-32 md:h-40 w-full mb-3 md:mb-4 rounded-lg overflow-hidden flex items-center justify-center">
            {coverPreview || eventData.coverImageUrl ? (
              <img
                src={coverPreview || (eventData.coverImageUrl ? `${API_URL}${eventData.coverImageUrl}` : undefined)}
                alt="Event Banner Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-400 italic">No banner uploaded yet</span>
            )}
          </div>
          {/* Vibe Video Upload */}
          <div className="mb-3 md:mb-4 text-sm md:text-base">
            <label className="block font-medium mb-2">Vibe Video (optional)</label>
            <label className="inline-block px-3 py-1.5 bg-white border border-gray-400 rounded-md shadow-sm cursor-pointer text-sm font-medium hover:bg-violet-50 hover:border-violet-400 transition-all">
              Choose File
              <input name="vibeVideo" type="file" accept="video/*" className="hidden" onChange={handleVibeVideoUpload} />
            </label>
            <span className="text-xs text-gray-500 block mt-1">Upload a short video to showcase the vibe of your event.</span>
          </div>

          {/* Organizer */}
          <label className="font-medium text-gray-700 flex flex-col gap-1 mb-2 italic text-sm md:text-base">
            <span className="flex items-center">Organizer Name<span className="text-red-500 ml-1">*</span></span>
            <div className="relative">
              <input name="OrganizerName" type="text" placeholder="Your name or organization" required onChange={handleInputChange} value={eventData.OrganizerName} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition duration-200 pr-10 font-normal not-italic" />
              {eventData.OrganizerName && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              )}
            </div>
          </label>
          {/* Organizer Email */}
          <label className="font-medium text-gray-700 flex flex-col gap-1 mb-2 italic text-sm md:text-base">
            <span className="flex items-center">Organizer Email<span className="text-red-500 ml-1">*</span></span>
            <div className="relative">
              <input name="organizerEmail" type="email" placeholder="e.g. you@email.com" required onChange={handleInputChange} value={eventData.organizerEmail} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition duration-200 pr-10 font-normal not-italic" />
              {eventData.organizerEmail && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              )}
            </div>
          </label>

          {/* Event Start & End Date & Time in same row */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-2 md:mb-4">
            <label className="font-medium text-gray-700 flex flex-col gap-1 mb-2 flex-1 italic text-sm md:text-base">
              <span className="flex items-center">Event Start Date & Time<span className="text-red-500 ml-1">*</span></span>
              <div className="relative">
                <div className="border-2 border-gray-300 rounded-md bg-white shadow px-3 py-2 min-h-[48px] flex items-center">
                  <input name="eventStart" type="datetime-local" required onChange={handleInputChange} value={eventData.eventStart} className="input input-bordered w-full pr-10 bg-transparent border-none focus:ring-0 focus:border-none font-normal not-italic" />
                </div>
                {eventData.eventStart && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                )}
              </div>
            </label>
            <label className="font-medium text-gray-700 flex flex-col gap-1 mb-2 flex-1 italic text-sm md:text-base">
              <span className="flex items-center">Event End Date & Time<span className="text-red-500 ml-1">*</span></span>
              <div className="relative">
                <div className="border-2 border-gray-300 rounded-md bg-white shadow px-3 py-2 min-h-[48px] flex items-center">
                  <input name="eventEnd" type="datetime-local" required onChange={handleInputChange} value={eventData.eventEnd} className="input input-bordered w-full pr-10 bg-transparent border-none focus:ring-0 focus:border-none font-normal not-italic" />
                </div>
                {eventData.eventEnd && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                )}
              </div>
            </label>
          </div>
          {/* Recurrence Type */}
<label htmlFor="recurrenceType" className="flex items-center font-medium mb-1 italic text-sm md:text-base">Recurrence Type<span className="text-red-500 ml-1">*</span>
  <div>
    <select
      id="recurrenceType"
      name="recurrenceType"
      onChange={handleInputChange}
      value={eventData.recurrenceType}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-orange-500 transition duration-200"
    >
      <option value="None">None</option>
      <option value="rule">Rule-based</option>
      <option value="custom">Custom Dates</option>
    </select>
  </div>
</label>
{/* Occurrences Section - only for non-recurring events */}
{/* Rule-based recurrence input */}
{eventData.recurrenceType === 'rule' && (
  <div className="mb-4">
    <label className="block font-medium mb-2 italic text-sm md:text-base">Recurrence Rule (iCal format)<span className="text-red-500 ml-1">*</span>
      <input
        name="recurrenceRule"
        type="text"
        placeholder="e.g. FREQ=WEEKLY;BYDAY=MO,WE,FR"
        required
        onChange={handleInputChange}
        value={eventData.recurrenceRule}
        className="input input-bordered w-full border-orange-400 bg-orange-50 text-amber-700 font-semibold pr-10"
      />
      <span className="text-xs text-gray-500 mt-1 block">Note: Only the first 10 occurrences will be created and shown for rule-based recurrence.</span>
    </label>
    {/* Display up to 10 occurrences for rule-based recurrence */}
    {Array.isArray(eventData.occurrences) && eventData.occurrences.length > 0 && (
      <div className="mt-2">
        <div className="font-semibold text-gray-700 mb-1">First 10 Occurrences:</div>
        <ul className="list-disc pl-6 text-sm text-gray-800">
          {eventData.occurrences.slice(0, 10).map((occ: any, idx: number) => (
            <li key={idx}>
              {occ.start ? new Date(occ.start).toLocaleString() : ''}
              {occ.end ? ` to ${new Date(occ.end).toLocaleString()}` : ''}
            </li>
          ))}
        </ul>
        {eventData.occurrences.length > 10 && (
          <div className="mt-1 text-xs text-gray-500 italic">Only first 10 occurrences shown.</div>
        )}
      </div>
    )}
  </div>
)}

{/* Custom dates recurrence input */}
{eventData.recurrenceType === 'custom' && (
  <div className="mb-4">
    <label className="block font-medium mb-2 italic text-sm md:text-base">
      Custom Occurrences<span className="text-red-500 ml-1">*</span>
    </label>
    {(eventData.customDates || []).map((occ: any, idx: number) => (
      <div key={idx} className="flex gap-2 mb-2 items-center">
        <input
          type="datetime-local"
          value={occ && occ.start ? occ.start : ''}
          onChange={e => {
            setEventData((prev: any) => {
              // Deep copy to avoid reference issues
              const newDates = prev.customDates.map((item: any, i: number) =>
                i === idx ? { ...item, start: e.target.value } : { ...item }
              );
              return { ...prev, customDates: newDates, customFields: JSON.stringify(newDates) };
            });
          }}
          className="input input-bordered"
          placeholder="Start Date & Time"
        />
        <span className="font-bold">to</span>
        <input
          type="datetime-local"
          value={occ && occ.end ? occ.end : ''}
          onChange={e => {
            setEventData((prev: any) => {
              // Deep copy to avoid reference issues
              const newDates = prev.customDates.map((item: any, i: number) =>
                i === idx ? { ...item, end: e.target.value } : { ...item }
              );
              return { ...prev, customDates: newDates, customFields: JSON.stringify(newDates) };
            });
          }}
          className="input input-bordered"
          placeholder="End Date & Time"
        />
        <button type="button" onClick={() => {
          setEventData((prev: any) => {
            const newDates = prev.customDates.filter((_: any, i: number) => i !== idx);
            return { ...prev, customDates: newDates, customFields: JSON.stringify(newDates) };
          });
        }} className="px-2 py-1 bg-red-500 text-white rounded">Remove</button>
      </div>
    ))}
    <button type="button" onClick={() => {
      // Always create a new object for each occurrence to avoid reference issues
      const newDates = [...(eventData.customDates ? eventData.customDates.map(d => ({ ...d })) : []), { start: '', end: '' }];
      setEventData({ ...eventData, customDates: newDates, customFields: JSON.stringify(newDates) });
    }} className="px-3 py-1 bg-green-500 text-white rounded">+ Add Occurrence</button>
    {/* Debug: Display the customDates array as JSON */}
    <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-700 font-mono">
      <strong>DEBUG customDates:</strong>
      <pre>{JSON.stringify(eventData.customDates, null, 2)}</pre>
    </div>
  </div>
)}
          {/* Location with event type options and conditional map or event link */}
          <div className="mb-2 text-sm md:text-base">
            <span className="block font-medium mb-2 italic">Event Type<span className="text-red-500 ml-1">*</span></span>
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
                  <span className="block font-medium mb-2 italic">Location<span className="text-red-500 ml-1">*</span></span>
                  <div className="relative">
                    <input name="location" type="text" placeholder="e.g. Gachibowli, Hyderabad" required onChange={handleInputChange} value={eventData.location} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition duration-200 pr-10" />
                    {eventData.location && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                    )}
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
              <label className="block font-medium mb-2 w-full mt-2 italic">Event Link<span className="text-red-500">*</span>
                
                <div className="relative">
                  <input
                    name="eventLink"
                    type="url"
                    placeholder="Enter event link (e.g. https://meet.example.com/xyz)"
                    required={eventData.type === 'Online'}
                    onChange={handleInputChange}
                    value={eventData.eventLink}
                    className="input input-bordered w-full pr-10"
                  />
                  {eventData.eventLink && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  )}
                </div>
              </label>
            )}
          </div>

          {/* Category */}
          <label className="block font-medium mb-2 italic text-sm md:text-base">Category<span className="text-red-500 ml-1">*</span>
            <div className="relative">
              <select name="category" onChange={handleInputChange} value={eventData.category} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-orange-500 transition duration-200 pr-10 font-normal not-italic">
                <option value="" disabled hidden>--Select--</option>
                <option value="Music">Music</option>
                <option value="Tech">Tech</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Business">Business</option>
                <option value="Conference">Conference</option>
                <option value="Exhibitions">Exhibitions</option>
                <option value="Others">Others</option>
              </select>
              {eventData.category && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              )}
            </div>
            
          </label>

          {/* Paid Event - Modern Toggle UI */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center gap-3 md:gap-5 mb-2 md:mb-3">
              <span className="font-semibold text-[15px] md:text-[16px]">Ticket Type:</span>
              <div className="flex items-center gap-2 md:gap-3">
                <span className={`min-w-[40px] text-right ${!eventData.isPaid ? 'text-green-500 font-bold' : 'text-gray-400 font-medium'} text-[15px] md:text-[16px]`}>Free</span>
                <button
                  type="button"
                  aria-label="Toggle Paid Event"
                  onClick={() => setEventData({ ...eventData, isPaid: !eventData.isPaid, price: !eventData.isPaid ? eventData.price : '' })}
                  className={`w-[44px] md:w-[54px] h-[18px] rounded-full border-none relative transition-colors duration-200 shadow focus:outline-none cursor-pointer flex items-center p-0 ${eventData.isPaid ? 'bg-orange-400' : 'bg-green-500'}`}
                >
                  <span
                    className="absolute top-1 left-1 transition-all duration-200"
                    style={{ left: eventData.isPaid ? 24 : 4, width: 20, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px #0002', display: 'block' }}
                  />
                </button>
                <span className={`min-w-[40px] text-left ${eventData.isPaid ? 'text-orange-400 font-bold' : 'text-gray-400 font-medium'} text-[15px] md:text-[16px]`}>Paid</span>
              </div>
            </div>
          <div className="mt-2 md:mt-3">
              {eventData.isPaid && (
                <>
                  <label className="block font-medium mb-2 text-sm md:text-base" style={{ marginBottom: 4 }}>Price (₹)<span className="text-red-500 ml-1">*</span></label>
                  <div className="relative">
                    <input
                      name="price"
                      type="number"
                      min="0"
                      placeholder="e.g. 500"
                      required={eventData.isPaid}
                      onChange={handleInputChange}
                      value={eventData.price}
                      className="input input-bordered w-full border-orange-400 bg-orange-50 text-amber-700 font-semibold pr-10"
                    />
                    {eventData.price && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                    )}
                  </div>
                </>
              )}
              {/* Max Attendees */}
              <label className="block font-medium mb-2 mt-4 italic text-sm md:text-base">Max People Can Attend<span className="text-red-500 ml-1">*</span>
                <div className="relative">
                  <input
                    name="maxAttendees"
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    required
                    onChange={handleInputChange}
                    value={eventData.maxAttendees}
                    className="input input-bordered w-full border-orange-400 bg-orange-50 text-amber-700 font-semibold pr-10 font-normal not-italic"
                  />
                  {eventData.maxAttendees && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  )}
                </div>
              </label>
              {/* Registration Deadline (always visible) */}
          <label className="font-medium text-gray-700 flex flex-col gap-1 mb-2 mt-4 italic text-sm md:text-base">
                <span className="flex items-center">Registration Deadline<span className="text-red-500 ml-1">*</span></span>
                <div className="relative">
                  <input
                    name="registrationDeadline"
                    type="datetime-local"
                    required
                    onChange={handleInputChange}
                    value={eventData.registrationDeadline}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-orange-500 transition duration-200 pr-10 font-normal not-italic"
                  />
                  {eventData.registrationDeadline && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Description with Tiptap Rich Text Editor, minimal toolbar, and visible formatting */}
          <span className="block font-medium mb-2 text-sm md:text-base">Event Description<span className="text-red-500 ml-1">*</span></span>
          <div className="mb-3 md:mb-4 not-italic">
            {/* Minimal Tiptap Toolbar */}
           {/* Toolbar */}
<div className="flex gap-1 md:gap-2 mb-2 flex-wrap">
  {/* Bold */}
  <button
    type="button"
    title="Bold"
    aria-label="Bold"
    onClick={() => editor && editor.chain().focus().toggleBold().run()}
    className={`toolbar-btn flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:bg-orange-100 active:scale-95 ${editor?.isActive('bold') ? 'bg-orange-200 text-orange-700' : 'bg-white text-gray-700'}`}
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 6a3 3 0 0 1 0 6H9V6h4zm0 6a3 3 0 0 1 0 6H9v-6h4z"/></svg>
  </button>

  {/* Italic */}
  <button
    type="button"
    title="Italic"
    aria-label="Italic"
    onClick={() => editor && editor.chain().focus().toggleItalic().run()}
    className={`toolbar-btn flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:bg-orange-100 active:scale-95 ${editor?.isActive('italic') ? 'bg-orange-200 text-orange-700' : 'bg-white text-gray-700'}`}
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 4h-4a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4"/></svg>
  </button>

  {/* Bullet List */}
  <button
    type="button"
    title="Bullet List"
    aria-label="Bullet List"
    onClick={() => editor && editor.chain().focus().toggleBulletList().run()}
    className={`toolbar-btn flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:bg-orange-100 active:scale-95 ${editor?.isActive('bulletList') ? 'bg-orange-200 text-orange-700' : 'bg-white text-gray-700'}`}
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="6" cy="6" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="6" cy="18" r="1.5"/>
      <line x1="10" y1="6" x2="20" y2="6"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="10" y1="18" x2="20" y2="18"/>
    </svg>
  </button>
</div>

{/* Tiptap Content Area */}
<div className="prose max-w-none text-sm md:text-base" style={{ listStyleType: 'disc', paddingLeft: '1.5em' }}>
  <EditorContent editor={editor} />
</div>

            {/* Editor box with visible formatting as you type */}
            <div className="border border-gray-200 rounded-xl bg-white min-h-[120px] md:min-h-[180px] mb-0 p-2">
              <EditorContent 
                editor={editor} 
                className="outline-none focus:outline-none min-h-[160px] text-base text-gray-800 prose"
                style={{ listStyleType: 'disc', paddingLeft: '1.5em' }}
              />
            </div>
            {/* Upload buttons below, side by side */}
            <div className="flex flex-col sm:flex-row gap-0 mt-2">
              <label className="flex-1 flex items-center justify-center cursor-pointer bg-gray-100 rounded-bl-xl py-3 font-semibold text-base shadow border border-gray-200 border-t-0 border-r border-r-gray-200">
                🖼 Image
                <input type="file" accept="image/*" multiple onChange={handleImageUploadTiptap} className="hidden" />
              </label>
              <label className="flex-1 flex items-center justify-center cursor-pointer bg-gray-100 rounded-br-xl py-3 font-semibold text-base shadow border border-gray-200 border-t-0 border-l border-l-gray-200">
                🎬 Video
                <input type="file" accept="video/*" multiple onChange={handleVideoUploadTiptap} className="hidden" />
              </label>
            </div>
          </div>

          {/* Speakers */}
          <div>
            <label className="block font-medium mb-2 italic text-sm md:text-base">Speakers</label>
            {eventData.speakers.map((speaker: Speaker, idx: number) => (
              <div key={idx} className="relative mb-4 md:mb-6 flex flex-col sm:flex-row items-start gap-2">
                <div className="border border-gray-200 rounded-lg p-2 md:p-3 bg-slate-50 shadow-sm flex-1 relative min-h-[70px] md:min-h-[90px] flex flex-col justify-center">
                  <button
                    type="button"
                    onClick={() => removeSpeaker(idx)}
                    className="absolute top-2 right-2 bg-white border border-gray-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer shadow z-20 transition-colors duration-150 p-0"
                    title="Delete speaker"
                    aria-label="Delete speaker"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                  <div className="flex flex-col gap-1 items-start mb-1 w-full">
                    <div className="w-9 h-9 md:w-11 md:h-11 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-1">
                      {speaker.imagePreview ? (
                        <img src={speaker.imagePreview} alt={`Speaker ${idx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-xl">👤</span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Speaker Name"
                      value={speaker.name}
                      onChange={e => handleSpeakerNameChange(idx, e.target.value)}
                      className="input input-bordered text-[12px] md:text-[13px] h-7 px-2 py-0.5 rounded mb-0.5 w-full"
                    />
                    <label className="inline-block px-2 py-1 md:px-3 md:py-1.5 mt-1 bg-white border border-gray-400 rounded-md shadow-sm cursor-pointer text-xs md:text-sm font-medium hover:bg-violet-50 hover:border-violet-400 transition-all">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleSpeakerImageChange(idx, e)}
                        className="hidden"
                        title="Upload speaker image"
                        placeholder="Upload speaker image"
                      />
                    </label>
                  </div>
                  <textarea
                    placeholder="Speaker Bio"
                    value={speaker.bio}
                    onChange={e => handleSpeakerBioChange(idx, e.target.value)}
                    className="input input-bordered min-h-[28px] md:min-h-[36px] text-[12px] md:text-[13px] resize-vertical px-2 py-1 rounded w-full"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpeaker}
              className="mt-2 md:mt-4 px-3 md:px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition-all w-full text-sm md:text-base tracking-wide border-0"
            >
              + Add another speaker
            </button>
          </div>

          {/* FAQs Section */}
          <div className="my-5 md:my-8">
            <label className="block font-medium mb-2 italic text-sm md:text-base">Event FAQs</label>
            {eventData.faqs.map((faq: Faq, idx: number) => (
              <div key={idx} className="relative mb-3 md:mb-5 flex flex-col sm:flex-row items-start gap-2">
                <div className="border border-gray-200 rounded-lg p-2 md:p-3 bg-slate-50 shadow-sm flex-1 relative min-h-[40px] md:min-h-[60px] flex flex-col justify-center">
                  <button
                    type="button"
                    onClick={() => removeFaq(idx)}
                    className="absolute top-0 right-2 bg-white border border-gray-800 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer shadow z-20 transition-colors duration-150 p-0"
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
                    className="input input-bordered text-[12px] md:text-[13px] h-7 px-2 py-0.5 rounded mb-1 w-full"
                  />
                  <textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={e => handleFaqChange(idx, 'answer', e.target.value)}
                    className="input input-bordered min-h-[20px] md:min-h-[28px] text-[12px] md:text-[13px] resize-vertical px-2 py-1 rounded w-full"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addFaq}
              className="mt-2 px-3 md:px-5 py-2 rounded-xl bg-sky-600 text-white font-semibold shadow hover:bg-sky-700 transition-all w-full text-sm md:text-base tracking-wide border-0"
            >
              + Add another FAQ
            </button>
          </div>
          <button
            type="submit"
            className="w-full mt-4 md:mt-6 px-4 md:px-5 py-2 md:py-3 rounded-xl bg-green-600 text-white font-bold shadow hover:bg-green-700 transition-all text-base md:text-lg text-[1.1rem] border-0 tracking-wide"
          >
            Publish Event
          </button>
          {/* FAQs Preview */}
          <div className="my-4 md:my-6">
            <strong className="text-[1.1rem] text-[#222] italic">FAQs:</strong>
            {eventData.faqs.length === 0 || eventData.faqs.every(f => !f.question && !f.answer) ? (
              <span className="text-gray-500 ml-2">[No FAQs added]</span>
            ) : (
              <div className="mt-2">
                {eventData.faqs.map((faq, idx) => (
                  (faq.question || faq.answer) && (
                    <div key={idx} className="mb-4 bg-white rounded-lg shadow p-3">
                      <div className="font-semibold text-[15px] text-blue-700">Q{idx + 1}: {faq.question || <span className="text-gray-400">[Question]</span>}</div>
                      <div className="text-[14px] text-gray-700 mt-1 pl-2">A: {faq.answer || <span className="text-gray-300">[Answer]</span>}</div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Live Preview */}
        <div
          className={`relative bg-gradient-to-br from-orange-50 via-white to-yellow-100 rounded-2xl shadow-xl p-3 sm:p-6 md:p-10 flex-1 min-w-0 w-full max-w-full md:min-w-[320px] md:max-w-[600px] m-auto ring-2 md:ring-4 ring-orange-200/40 drop-shadow-[0_0_24px_rgba(251,146,60,0.25)] font-sans text-sm md:text-base tracking-[.01em] leading-[1.7] ${showMobilePreview ? '' : 'hidden'} lg:block`}
            style={{
    minHeight: '900px',
    height: '1000px', // or your preferred fixed height
    // overflowY: 'auto', // REMOVE this line
    marginTop: 0,
    marginBottom: 0,
  }}
        >
          {/* Ribbons Animation Overlay */}
          {showRibbons && (
            <>
              <div className="pointer-events-none absolute inset-0 z-50 overflow-visible">
                {/* Ribbons */}
                {Array.from({ length: 18 }).map((_, i) => {
                  const left = i < 9
                    ? `${5 + i * 8 + Math.random() * 2}%`
                    : `${55 + (i - 9) * 8 + Math.random() * 2}%`;
                  const colors = [
                    'bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-pink-400', 'bg-purple-400', 'bg-orange-400', 'bg-teal-400', 'bg-indigo-400',
                  ];
                  const color = colors[i % colors.length];
                  const delay = (Math.random() * 0.7).toFixed(2);
                  const duration = (2.2 + Math.random() * 0.8).toFixed(2);
                  const rotate = (Math.random() * 60 - 30).toFixed(0);
                  const width = 6 + Math.random() * 6;
                  const height = 36 + Math.random() * 24;
                  return (
                    <div
                      key={`ribbon-${i}`}
                      className={`absolute bottom-0 ${color}`}
                      style={{
                        left,
                        width: `${width}px`,
                        height: `${height}px`,
                        borderRadius: '8px',
                        opacity: 0.85,
                        transform: `rotate(${rotate}deg)`,
                        animation: `ribbon-shoot ${duration}s cubic-bezier(.22,1.2,.36,1) ${delay}s both`,
                        zIndex: 100,
                        boxShadow: '0 2px 8px #0002',
                      }}
                    />
                  );
                })}
                {/* Stars */}
                {Array.from({ length: 14 }).map((_, i) => {
                  // Randomize left, size, color, and animation
                  const left = `${Math.random() * 95}%`;
                  const delay = (Math.random() * 0.7).toFixed(2);
                  const duration = (1.7 + Math.random() * 1.2).toFixed(2);
                  const size = 18 + Math.random() * 12;
                  const color = [
                    '#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#facc15', '#f472b6', '#818cf8', '#f59e42', '#fcd34d', '#f9fafb', '#fef08a', '#fca5a5'
                  ][i % 14];
                  return (
                    <svg
                      key={`star-${i}`}
                      className="absolute bottom-0"
                      style={{
                        left,
                        width: `${size}px`,
                        height: `${size}px`,
                        opacity: 0.92,
                        zIndex: 101,
                        filter: 'drop-shadow(0 2px 8px #0002)',
                        animation: `star-shoot ${duration}s cubic-bezier(.22,1.2,.36,1) ${delay}s both`,
                      }}
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polygon points="16,2 20,12 31,12 22,18 25,29 16,23 7,29 10,18 1,12 12,12" fill={color} stroke="#eab308" strokeWidth="1.5" />
                    </svg>
                  );
                })}
              </div>
              {/* Keyframes for ribbons and stars */}
              <style>{`
                @keyframes ribbon-shoot {
                  0% {
                    opacity: 0.7;
                    transform: translateY(0) scaleY(1) rotate(var(--ribbon-rotate, 0deg));
                  }
                  10% {
                    opacity: 1;
                    transform: translateY(-60px) scaleY(1.1) rotate(var(--ribbon-rotate, 0deg));
                  }
                  40% {
                    opacity: 1;
                    transform: translateY(-220px) scaleY(1.1) rotate(var(--ribbon-rotate, 0deg));
                  }
                  70% {
                    opacity: 0.95;
                    transform: translateY(-120px) scaleY(0.95) rotate(var(--ribbon-rotate, 0deg));
                  }
                  100% {
                    opacity: 0;
                    transform: translateY(40px) scaleY(0.7) rotate(var(--ribbon-rotate, 0deg));
                  }
                }
                @keyframes star-shoot {
                  0% {
                    opacity: 0.7;
                    transform: translateY(0) scale(1) rotate(0deg);
                  }
                  10% {
                    opacity: 1;
                    transform: translateY(-60px) scale(1.1) rotate(10deg);
                  }
                  40% {
                    opacity: 1;
                    transform: translateY(-240px) scale(1.1) rotate(-10deg);
                  }
                  70% {
                    opacity: 0.95;
                    transform: translateY(-120px) scale(0.95) rotate(0deg);
                  }
                  100% {
                    opacity: 0;
                    transform: translateY(40px) scale(0.7) rotate(0deg);
                  }
                }
              `}</style>
            </>
          )}
          <div className="relative flex justify-center items-center h-[40px] md:h-[70px] w-full bg-center bg-no-repeat bg-contain"
     style={{ backgroundImage: 'url("/images/ribbon.png")', backgroundSize: '80% 60px, 80% 70px' }}>
  <span className="text-white font-bold text-base md:text-xl tracking-wide drop-shadow-lg uppercase italic">
    📌 Live Preview
  </span>
</div>
          <div className="space-y-2 text-sm md:text-base">
            <div><span className="font-semibold text-gray-700">Title:</span> <span className="text-gray-900">{eventData.title || <span className="text-gray-400">[Event Title]</span>}</span></div>
            {/* Banner Image Label above Preview */}
            <div className="text-lg text-orange-700 font-bold mt-6 mb-1 tracking-wide">Event Cover Image</div>
            <div className="relative h-32 md:h-40 w-full mb-3 md:mb-4 rounded-lg overflow-hidden flex items-center justify-center">
              {coverPreview || eventData.coverImageUrl ? (
                <img
                  src={coverPreview || (eventData.coverImageUrl ? `${API_URL}${eventData.coverImageUrl}` : undefined)}
                  alt="Event Banner Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-gray-400 italic">No banner uploaded yet</span>
              )}
            </div>

            {/* Vibe Video Label and Preview below Banner */}
            {eventData.vibeVideoPreview && (
              <div className="my-3">
                <div className="text-lg text-orange-700 font-bold mb-1 tracking-wide italic">Vibe Video</div>
                <video src={eventData.vibeVideoPreview.startsWith('blob:') ? eventData.vibeVideoPreview : `${API_URL}${eventData.vibeVideoPreview}`} controls className="w-full max-h-[180px] rounded-lg bg-black border border-orange-200 shadow" />
              </div>
            )}
            <div><span className="font-semibold text-gray-700">Organizer:</span> <span className="text-gray-900">{eventData.OrganizerName || <span className="text-gray-400">[Organizer]</span>}</span></div>
            <div><span className="font-semibold text-gray-700">Organizer Email:</span> <span className="text-gray-900">{eventData.organizerEmail || <span className="text-gray-400">[Organizer Email]</span>}</span></div>
            <div><span className="font-semibold text-gray-700">Event Start:</span> <span className="text-gray-900">{eventData.eventStart || <span className="text-gray-400">[Start Date & Time]</span>}</span></div>
            <div><span className="font-semibold text-gray-700">Event End:</span> <span className="text-gray-900">{eventData.eventEnd || <span className="text-gray-400">[End Date & Time]</span>}</span></div>
            <div><span className="font-semibold text-gray-700">Registration Deadline:</span> <span className="text-gray-900">{eventData.registrationDeadline || <span className="text-gray-400">[Registration Deadline]</span>}</span></div>
            <div><span className="font-semibold text-gray-700">Recurrence Type:</span> <span className="text-gray-900">{eventData.recurrenceType || <span className="text-gray-400">[Recurrence Type]</span>}</span></div>
            {eventData.type === 'Location Based' && (
              <div><span className="font-semibold text-gray-700">Location:</span> <span className="text-gray-900">{eventData.location || <span className="text-gray-400">[Location]</span>}</span></div>
            )}
            {/* Event Link Preview (explicit, for clarity) */}
            {eventData.type === 'Online' && (
              <div>
                <span className="font-semibold text-gray-700">Event Link:</span>
                {eventData.eventLink ? (
                  <a href={eventData.eventLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline ml-2">{eventData.eventLink}</a>
                ) : (
                  <span className="text-gray-400 ml-2">[Event Link]</span>
                )}
              </div>
            )}
            <div><span className="font-semibold text-gray-700">Type:</span> <span className="text-gray-900">{eventData.type}</span></div>
            <div><span className="font-semibold text-gray-700">Category:</span> <span className="text-gray-900">{eventData.category}</span></div>
            <div className="mt-2 mb-4">
              <span className="font-semibold text-gray-700">Ticket Type:</span>
              {eventData.isPaid ? (
                <span className="inline-block ml-2 bg-orange-400 text-white rounded-lg px-4 py-0.5 font-bold text-[16px] tracking-wide shadow-[0_1px_4px_#f59e4222]">Paid - ₹{eventData.price || '0'}</span>
              ) : (
                <span className="inline-block ml-2 bg-green-500 text-white rounded-lg px-4 py-0.5 font-bold text-[16px] tracking-wide shadow-[0_1px_4px_#22c55e22]">Free</span>
              )}
              <span className="ml-4 font-semibold text-gray-700">Max People Can Attend:</span> <span className="text-gray-900">{eventData.maxAttendees || <span className="text-gray-400">[Not set]</span>}</span>
            </div>
            <div className="my-6">
              <div className="font-bold text-lg text-orange-700 mb-2 tracking-wide">Description</div>
              <div
                className="prose prose-lg max-w-none bg-white/80 border border-gray-200 rounded-lg p-4 mt-2 shadow-sm description-preview text-[1.13rem] leading-[1.8] text-gray-800 min-h-[80px] tracking-[.01em] font-sans"
                style={{ listStyleType: 'disc', paddingLeft: '1.5em' }}
                dangerouslySetInnerHTML={{ __html: eventData.description || '<span style=\"color:#bbb\">[Description]</span>' }}
              />
            </div>
            <div className="my-6">
              <div className="font-bold text-lg text-orange-700 mb-2 tracking-wide">Speakers</div>
              {eventData.speakers.length === 0 || eventData.speakers.every((s: Speaker) => !s.name && !s.bio && !s.imagePreview) ? (
                <span className="text-gray-400 ml-2">[No speakers added]</span>
              ) : (
                <div className="mt-2 space-y-3">
              {eventData.speakers.map((speaker: Speaker, idx: number) =>
        (speaker.name || speaker.bio || speaker.imagePreview) ? (
          <div key={idx} className="flex items-start gap-4 mb-2 bg-white rounded-lg shadow p-3 border border-orange-100">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {speaker.imagePreview ? (
                <img src={speaker.imagePreview} alt={`Speaker ${idx + 1}`} className="w-full h-full object-cover" />
              ) : speaker.photoUrl ? (
                <img src={`${API_URL}${speaker.photoUrl}`} alt={`Speaker ${idx + 1}`} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[16px] text-gray-800">{speaker.name || <span className="text-gray-400">[Name]</span>}</div>
              <div className="text-[14px] text-gray-700 mt-1 leading-6">{speaker.bio || <span className="text-gray-300">[Bio]</span>}</div>
            </div>
          </div>
        ) : null
      )}
    </div>
  )}
</div>
            {/* FAQs Preview in Live Preview */}
            <div className="my-6">
              <div className="font-bold text-lg text-orange-700 mb-2 tracking-wide">FAQs</div>
              {eventData.faqs.length === 0 || eventData.faqs.every((f: Faq) => !f.question && !f.answer) ? (
                <span className="text-gray-400 ml-2">[No FAQs added]</span>
              ) : (
                <div className="mt-2 space-y-3">
                  {eventData.faqs.map((faq, idx) => (
                    (faq.question || faq.answer) && (
                      <div key={idx} className="mb-2 bg-white rounded-lg shadow p-3 border border-orange-100">
                        <div className="font-semibold text-[15px] text-blue-700">Q{idx + 1}: {faq.question || <span className="text-gray-400">[Question]</span>}</div>
                        <div className="text-[14px] text-gray-700 mt-1 pl-2 leading-6">A: {faq.answer || <span className="text-gray-300">[Answer]</span>}</div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
            {/* Vibe Video Preview (from backend after creation) */}
            {eventData.vibeVideoPreview && (
              <div className="my-6">
                <div className="font-bold text-lg text-orange-700 mb-2 tracking-wide">Vibe Video</div>
                <video src={eventData.vibeVideoPreview.startsWith('blob:') ? eventData.vibeVideoPreview : `${API_URL}${eventData.vibeVideoPreview}`} controls className="w-full max-w-[400px] mt-2 rounded-lg border border-orange-200 shadow" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
