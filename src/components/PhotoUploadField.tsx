import PhotoUpload from "./PhotoUpload";

type PhotoUploadFieldProps = {
  name?: string;
  value?: string[];
  onChange?: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
};

/**
 * Server-compatible wrapper for PhotoUpload.
 *
 * This is NOT a form-connected input (Next.js Server Actions don't support
 * file uploads directly). Use it alongside a FormData handler that reads
 * the uploaded photo URLs from the `onChange` callback.
 *
 * Usage inside a client form:
 *   <PhotoUploadField
 *     multiple
 *     value={existingUrls}
 *   />
 *
 * The uploaded URLs are available through the component's internal state
 * and exposed via the `onChange` callback on the underlying PhotoUpload.
 */
export default function PhotoUploadField({
  name,
  value = [],
  onChange,
  multiple = false,
  maxFiles = 10,
}: PhotoUploadFieldProps) {
  return (
    <div data-field={name} className="space-y-2">
      {name && (
        <label className="block text-sm font-medium text-zinc-700">
          {name.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
        </label>
      )}
      <PhotoUpload
        value={value}
        onChange={onChange}
        multiple={multiple}
        maxFiles={maxFiles}
      />
    </div>
  );
}
