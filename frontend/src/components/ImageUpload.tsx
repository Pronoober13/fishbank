'use client';

import { useState, useRef } from 'react';
import { uploadApi } from '@/lib/api';

interface ImageUploadProps {
  token: string;
  images: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  min?: number;
}

export default function ImageUpload({ token, images, onChange, max = 10, min = 3 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');

    const remaining = max - images.length;
    if (remaining <= 0) { setError(`Maksimal ${max} foto`); return; }

    const selected = Array.from(files).slice(0, remaining);

    // Validate each file
    for (const f of selected) {
      if (f.size > 5 * 1024 * 1024) { setError('Ukuran file maksimal 5MB'); return; }
      if (!/\.(jpg|jpeg|png|webp)$/i.test(f.name)) { setError('Hanya JPG, PNG, WebP'); return; }
    }

    setUploading(true);
    try {
      const urls = await uploadApi.upload(selected, token);
      onChange([...images, ...urls]);
    } catch (err: any) {
      setError(err.message || 'Upload gagal');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
              <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-ocean-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                  Utama
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {images.length < max && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-ocean-400 hover:bg-ocean-50/30 transition"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-ocean-200 border-t-ocean-600 rounded-full animate-spin" />
              <span className="text-sm text-slate-500">Mengupload...</span>
            </div>
          ) : (
            <>
              <div className="text-3xl mb-2">📷</div>
              <p className="text-sm text-slate-500">Klik atau drag foto ke sini</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP · Max 5MB · {images.length}/{max} foto (min {min})</p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-rose-500 mt-2">{error}</p>}
    </div>
  );
}
