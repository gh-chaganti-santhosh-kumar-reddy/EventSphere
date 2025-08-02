import React from 'react';

// Example props type, adjust as needed for your actual event data shape
type Speaker = {
  name: string;
  bio: string;
  imagePreview?: string;
  photoUrl?: string;
};
type Faq = { question: string; answer: string };

type EventDetailProps = {
  event: {
    title: string;
    coverImageUrl?: string;
    OrganizerName: string;
    organizerEmail: string;
    eventStart: string;
    eventEnd: string;
    registrationDeadline: string;
    recurrenceType: string;
    location?: string;
    type: string;
    eventLink?: string;
    category: string;
    isPaid: boolean;
    price?: string;
    maxAttendees: string;
    description: string;
    speakers: Speaker[];
    faqs: Faq[];
    vibeVideoPreview?: string;
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function EventDetail({ event }: EventDetailProps) {
  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-white to-yellow-100 rounded-2xl shadow-xl p-3 sm:p-6 md:p-10 w-full max-w-3xl mx-auto my-8 font-sans text-sm md:text-base tracking-[.01em] leading-[1.7]">
      <div className="relative flex justify-center items-center h-[40px] md:h-[70px] w-full bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: 'url("/images/ribbon.png")', backgroundSize: '80% 60px, 80% 70px' }}>
        <span className="text-white font-bold text-base md:text-xl tracking-wide drop-shadow-lg uppercase italic">
          📌 Event Details
        </span>
      </div>
      <div className="space-y-2 text-sm md:text-base">
        <div><span className="font-semibold text-gray-700">Title:</span> <span className="text-gray-900">{event.title || <span className="text-gray-400">[Event Title]</span>}</span></div>
        <div className="text-lg text-orange-700 font-bold mt-6 mb-1 tracking-wide">Event Cover Image</div>
        <div
          className="relative w-full mb-3 md:mb-4 rounded-lg overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: '16/9', background: '#f3f4f6', minHeight: '250px', maxHeight: '400px' }}
        >
          {event.coverImageUrl ? (
            <img
              src={`${API_URL}${event.coverImageUrl}`}
              alt="Event Banner Preview"
              className="w-auto h-auto max-h-full max-w-full object-contain bg-white"
              style={{ display: 'block', margin: '0 auto', background: 'white', maxHeight: '100%', maxWidth: '100%' }}
            />
          ) : (
            <span className="text-gray-400 italic">No banner uploaded yet</span>
          )}
        </div>
        {event.vibeVideoPreview && (
          <div className="my-3">
            <div className="text-lg text-orange-700 font-bold mb-1 tracking-wide italic">Vibe Video</div>
            <video src={event.vibeVideoPreview.startsWith('blob:') ? event.vibeVideoPreview : `${API_URL}${event.vibeVideoPreview}`} controls className="w-full max-h-[180px] rounded-lg bg-black border border-orange-200 shadow" />
          </div>
        )}
        <div><span className="font-semibold text-gray-700">Organizer:</span> <span className="text-gray-900">{event.OrganizerName || <span className="text-gray-400">[Organizer]</span>}</span></div>
        <div><span className="font-semibold text-gray-700">Organizer Email:</span> <span className="text-gray-900">{event.organizerEmail || <span className="text-gray-400">[Organizer Email]</span>}</span></div>
        <div><span className="font-semibold text-gray-700">Event Start:</span> <span className="text-gray-900">{event.eventStart || <span className="text-gray-400">[Start Date & Time]</span>}</span></div>
        <div><span className="font-semibold text-gray-700">Event End:</span> <span className="text-gray-900">{event.eventEnd || <span className="text-gray-400">[End Date & Time]</span>}</span></div>
        <div><span className="font-semibold text-gray-700">Registration Deadline:</span> <span className="text-gray-900">{event.registrationDeadline || <span className="text-gray-400">[Registration Deadline]</span>}</span></div>
        <div><span className="font-semibold text-gray-700">Recurrence Type:</span> <span className="text-gray-900">{event.recurrenceType || <span className="text-gray-400">[Recurrence Type]</span>}</span></div>
        {event.type === 'Location Based' && (
          <div><span className="font-semibold text-gray-700">Location:</span> <span className="text-gray-900">{event.location || <span className="text-gray-400">[Location]</span>}</span></div>
        )}
        {event.type === 'Online' && (
          <div>
            <span className="font-semibold text-gray-700">Event Link:</span>
            {event.eventLink ? (
              <a href={event.eventLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline ml-2">{event.eventLink}</a>
            ) : (
              <span className="text-gray-400 ml-2">[Event Link]</span>
            )}
          </div>
        )}
        <div><span className="font-semibold text-gray-700">Type:</span> <span className="text-gray-900">{event.type}</span></div>
        <div><span className="font-semibold text-gray-700">Category:</span> <span className="text-gray-900">{event.category}</span></div>
        <div className="mt-2 mb-4">
          <span className="font-semibold text-gray-700">Ticket Type:</span>
          {event.isPaid ? (
            <span className="inline-block ml-2 bg-orange-400 text-white rounded-lg px-4 py-0.5 font-bold text-[16px] tracking-wide shadow-[0_1px_4px_#f59e4222]">Paid - ₹{event.price || '0'}</span>
          ) : (
            <span className="inline-block ml-2 bg-green-500 text-white rounded-lg px-4 py-0.5 font-bold text-[16px] tracking-wide shadow-[0_1px_4px_#22c55e22]">Free</span>
          )}
          <span className="ml-4 font-semibold text-gray-700">Max People Can Attend:</span> <span className="text-gray-900">{event.maxAttendees || <span className="text-gray-400">[Not set]</span>}</span>
        </div>
        <div className="my-6">
          <div className="font-bold text-lg text-orange-700 mb-2 tracking-wide">Description</div>
          <div
            className="prose prose-lg max-w-none bg-white/80 border border-gray-200 rounded-lg p-4 mt-2 shadow-sm description-preview text-[1.13rem] leading-[1.8] text-gray-800 min-h-[80px] tracking-[.01em] font-sans"
            style={{ listStyleType: 'disc', paddingLeft: '1.5em' }}
            dangerouslySetInnerHTML={{ __html: event.description || '<span style="color:#bbb">[Description]</span>' }}
          />
        </div>
        <div className="my-6">
          <div className="font-bold text-lg text-orange-700 mb-2 tracking-wide">Speakers</div>
          {event.speakers.length === 0 || event.speakers.every((s: Speaker) => !s.name && !s.bio && !s.imagePreview) ? (
            <span className="text-gray-400 ml-2">[No speakers added]</span>
          ) : (
            <div className="mt-2 space-y-3">
              {event.speakers.map((speaker: Speaker, idx: number) =>
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
        <div className="my-6">
          <div className="font-bold text-lg text-orange-700 mb-2 tracking-wide">FAQs</div>
          {event.faqs.length === 0 || event.faqs.every((f: Faq) => !f.question && !f.answer) ? (
            <span className="text-gray-400 ml-2">[No FAQs added]</span>
          ) : (
            <div className="mt-2 space-y-3">
              {event.faqs.map((faq, idx) => (
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
      </div>
    </div>
  );
}
