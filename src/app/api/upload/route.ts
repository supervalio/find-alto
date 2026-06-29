import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "node:crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const IMAGE_SIGNATURES: Record<string, number[]> = {
  png: [0x89, 0x50, 0x4e, 0x47],
  jpg: [0xff, 0xd8, 0xff],
  gif: [0x47, 0x49, 0x46],
  webp: [0x52, 0x49, 0x46, 0x46],
};

function isValidImage(buffer: Buffer): boolean {
  return Object.values(IMAGE_SIGNATURES).some((sig) =>
    sig.every((byte, i) => buffer[i] === byte),
  );
}

function generateFilename(originalName: string): string {
  const ext =
    (originalName.split(".").pop() ?? "jpg")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase() || "jpg";
  return `${randomUUID()}.${ext}`;
}

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured", success: false },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided", success: false },
        { status: 400 },
      );
    }

    const uploaded: { url: string }[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      if (file.size > MAX_FILE_SIZE) continue;
      if (!file.type.startsWith("image/")) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      if (!isValidImage(buffer)) continue;

      const filename = generateFilename(file.name);

      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Storage upload error:", error.message);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(data.path);

      uploaded.push({ url: urlData.publicUrl });
    }

    if (uploaded.length === 0) {
      return NextResponse.json(
        { error: "No valid image files found", success: false },
        { status: 400 },
      );
    }

    return NextResponse.json({
      urls: uploaded.map((u) => u.url),
      url: uploaded[0].url,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files", success: false },
      { status: 500 },
    );
  }
}
