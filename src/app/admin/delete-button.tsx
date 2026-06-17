"use client";

export function DeleteButton({
  action,
  id,
  label,
}: {
  action: (formData: FormData) => Promise<void>;
  id: number;
  label: string;
}) {
  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg px-3 py-1 text-xs text-red-600 hover:bg-red-50 transition-colors"
        onClick={(e) => {
          if (!confirm(`Удалить «${label}»?`)) {
            e.preventDefault();
          }
        }}
      >
        Удалить
      </button>
    </form>
  );
}
