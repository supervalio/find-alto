"use client";

import { useState } from "react";
import PhotoUploadField from "@/components/PhotoUploadField";
import { addItemPhoto, deleteItemPhoto } from "@/app/admin/actions";

type Photo = {
  id: number;
  url: string;
  alt: string | null;
  sortOrder: number | null;
};

type Props = {
  itemId: number;
  photos: Photo[];
};

export function ItemPhotoManager({ itemId, photos }: Props) {
  // Track which photos are being deleted (optimistic UI)
  const [pendingDelete, setPendingDelete] = useState<Set<number>>(new Set());
  const [isUploading, setIsUploading] = useState(false);

  const visiblePhotos = photos.filter((p) => !pendingDelete.has(p.id));

  const handleUpload = async (urls: string[]) => {
    if (urls.length === 0) return;
    setIsUploading(true);
    try {
      for (const url of urls) {
        const formData = new FormData();
        formData.append("itemId", String(itemId));
        formData.append("url", url);
        formData.append("alt", "");
        await addItemPhoto(formData);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (photoId: number) => {
    setPendingDelete((prev) => new Set(prev).add(photoId));
    const formData = new FormData();
    formData.append("id", String(photoId));
    await deleteItemPhoto(formData);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-zinc-700">
        Фото вещи
      </label>

      {/* Existing photos grid */}
      {visiblePhotos.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {visiblePhotos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt={photo.alt || ""}
                className="w-24 h-24 object-cover rounded-lg border border-zinc-200"
              />
              <button
                type="button"
                onClick={() => handleDelete(photo.id)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-zinc-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Delete photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload new photos */}
      {isUploading && <p className="text-xs text-zinc-400">Загрузка фото…</p>}
      <PhotoUploadField
        name="itemPhotos"
        multiple
        maxFiles={10}
        value={[]}
        onChange={handleUpload}
      />
    </div>
  );
}
