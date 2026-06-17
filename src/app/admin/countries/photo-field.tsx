"use client";

import { useState } from "react";
import PhotoUploadField from "@/components/PhotoUploadField";

export function CountryPhotoField({ defaultValue }: { defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue || "");
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1">Изображение</label>
      <PhotoUploadField name="image" multiple={false} maxFiles={1} value={url ? [url] : []} onChange={(urls) => setUrl(urls[0] || "")} />
      <input type="hidden" name="image" value={url} />
    </div>
  );
}
