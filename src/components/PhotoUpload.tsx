"use client";

import { useState, useRef, useCallback } from "react";

type UploadedFile = {
  url: string;
  name: string;
};

type PhotoUploadProps = {
  value?: string[];
  onChange?: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
};

export default function PhotoUpload({
  value = [],
  onChange,
  multiple = false,
  maxFiles = 10,
}: PhotoUploadProps) {
  const [uploaded, setUploaded] = useState<UploadedFile[]>(
    value.map((url) => ({
      url,
      name: url.split("/").pop() ?? url,
    }))
  );
  const [previews, setPreviews] = useState<
    { file: File; dataUrl: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalFiles = uploaded.length + previews.length;

  const notify = useCallback(
    (updated: UploadedFile[]) => {
      onChange?.(updated.map((f) => f.url));
    },
    [onChange]
  );

  const addPreviews = (files: FileList | File[]) => {
    if (totalFiles >= maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const remaining = maxFiles - totalFiles;
    const selected = Array.from(files).slice(0, remaining);
    const imageFiles = selected.filter((f) => f.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      setError("Please select image files");
      return;
    }

    setError(null);

    const newPreviews = imageFiles.map((file) => ({
      file,
      dataUrl: URL.createObjectURL(file),
    }));

    setPreviews((prev) => [...prev, ...newPreviews].slice(0, maxFiles - uploaded.length));
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].dataUrl);
      next.splice(index, 1);
      return next;
    });
  };

  const removeUploaded = (index: number) => {
    setUploaded((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      notify(next);
      return next;
    });
  };

  const handleUpload = async () => {
    if (previews.length === 0) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    previews.forEach((p) => formData.append("file", p.file));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Upload failed");
        return;
      }

      const urls: string[] = data.urls ?? [data.url];
      const newUploaded: UploadedFile[] = urls.map((url: string) => ({
        url,
        name: url.split("/").pop() ?? url,
      }));

      // Clean up previews
      previews.forEach((p) => URL.revokeObjectURL(p.dataUrl));
      setPreviews([]);

      const updated = [...uploaded, ...newUploaded];
      setUploaded(updated);
      notify(updated);
    } catch {
      setError("Network error — please try again");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addPreviews(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addPreviews(e.target.files);
    }
    // Reset so re-selecting the same file works
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      {/* ── Uploaded thumbnails ─────────────────────────── */}
      {uploaded.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {uploaded.map((file, i) => (
            <div key={file.url} className="relative group">
              <img
                src={file.url}
                alt={file.name}
                className="w-24 h-24 object-cover rounded-lg border border-zinc-200"
              />
              <button
                type="button"
                onClick={() => removeUploaded(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-zinc-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Preview thumbnails (not yet uploaded) ────────── */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((preview, i) => (
            <div key={preview.dataUrl} className="relative group">
              <img
                src={preview.dataUrl}
                alt={preview.file.name}
                className="w-24 h-24 object-cover rounded-lg border border-zinc-300 opacity-80"
              />
              <button
                type="button"
                onClick={() => removePreview(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-zinc-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Remove preview"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Drop zone ────────────────────────────────────── */}
      <div
        onClick={triggerFileInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed
          p-8 text-center transition-colors
          ${dragOver
            ? "border-zinc-400 bg-zinc-100"
            : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto w-10 h-10 text-zinc-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>

        <p className="text-sm text-zinc-500">
          {dragOver
            ? "Drop images here"
            : "Click or drag images here to upload"}
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          {multiple
            ? `PNG, JPG — up to ${maxFiles} files`
            : "PNG, JPG — single file"}
        </p>
      </div>

      {/* ── Error ────────────────────────────────────────── */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* ── Upload button ────────────────────────────────── */}
      {previews.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload {previews.length > 1 ? `${previews.length} photos` : "photo"}
            </>
          )}
        </button>
      )}

      {/* ── Progress text ────────────────────────────────── */}
      {uploaded.length > 0 && (
        <p className="text-xs text-zinc-400">
          {uploaded.length} file{uploaded.length !== 1 ? "s" : ""} uploaded
        </p>
      )}
    </div>
  );
}
