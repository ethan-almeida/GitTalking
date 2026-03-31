'use client';

import { useState } from 'react';

interface ImageModalProps {
  src: string;
  alt: string;
}

export default function ImageModal({ src, alt }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (!src) return null;
  return (
    <>
      <img 
        src={src} 
        alt={alt} 
        className="max-w-xs max-h-40 rounded border object-cover cursor-pointer hover:opacity-90 transition"
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative max-w-full max-h-full">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-xl hover:bg-gray-200 z-50"
            >
              &times;
            </button>

            <img 
              src={src} 
              alt={alt} 
              className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            
          </div>
        </div>
      )}
    </>
  );
}