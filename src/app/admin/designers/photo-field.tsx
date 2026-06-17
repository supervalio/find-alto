"use client";

import { useState } from "react";
import PhotoUploadField from "@/components/PhotoUploadField";

export function DesignerPhotoField({
  defaultValue,
}: {
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue || "");

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1">
        Фото
      </label>
      <PhotoUploadField
        name="photo"
        multiple={false}
        maxFiles={1}
        value={url ? [url] : []}
        onChange={(urls) => setUrl(urls[0] || "")}
      />
      <input type="hidden" name="photo" value={url} />
    </div>
  );
}
