'use client';

import { useRef, useState, useTransition } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  label: string;
  currentUrl?: string | null;
  accept?: string;
  onUpload: (formData: FormData) => Promise<{ ok: boolean; url?: string; error?: string } | undefined>;
}

export default function ImageDropzone({ label, currentUrl, accept = 'image/*', onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [pending, startTransition] = useTransition();

  function handleFile(file: File) {
    const fd = new FormData();
    fd.set('file', file);
    setPreview(URL.createObjectURL(file));
    startTransition(async () => {
      const result = await onUpload(fd);
      if (!result || !result.ok) {
        toast.error(result?.error ?? 'Upload failed');
        setPreview(currentUrl ?? null);
        return;
      }
      if (result.url) setPreview(result.url);
      toast.success(`${label} uploaded`);
    });
  }

  return (
    <div>
      <div className="admin-label">{label}</div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={`relative aspect-[4/3] rounded-2xl border-2 border-dashed cursor-pointer flex items-center justify-center overflow-hidden transition-colors ${
          pending ? 'border-amber-300 bg-amber-50/40' : 'border-[var(--admin-line)] hover:border-[var(--admin-gold)] bg-stone-50'
        }`}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={label} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white text-xs">
              <span className="bg-black/40 backdrop-blur px-2 py-1 rounded-full">{pending ? 'Uploading…' : 'Replace'}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                }}
                className="bg-black/40 backdrop-blur p-1.5 rounded-full"
                aria-label="Clear preview"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center px-4 text-[var(--admin-muted)]">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-stone-200 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="text-sm font-medium text-[var(--admin-ink)]">Click or drop an image</div>
            <div className="text-xs mt-1">PNG, JPG, WebP, or SVG · up to 8 MB</div>
          </div>
        )}
        {pending ? (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-200 overflow-hidden">
            <div className="h-full w-1/2 bg-amber-500 animate-pulse" />
          </div>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = '';
        }}
      />
      {currentUrl ? (
        <a href={currentUrl} target="_blank" rel="noreferrer" className="text-xs text-[var(--admin-muted)] hover:text-[var(--admin-accent)] mt-2 inline-flex items-center gap-1">
          <Upload className="w-3 h-3" /> Open current
        </a>
      ) : null}
    </div>
  );
}
