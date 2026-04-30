import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_BASE = "https://connector-gateway.lovable.dev/google_drive";

const InputSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  /** Base64-encoded file content. */
  contentBase64: z.string().min(1),
  folderId: z.string().min(1).max(100),
});

export const uploadToDrive = createServerFn({ method: "POST" })
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
    if (!GOOGLE_DRIVE_API_KEY)
      throw new Error("GOOGLE_DRIVE_API_KEY is not configured");

    // Decode base64 to bytes
    const binary = Buffer.from(data.contentBase64, "base64");

    // Multipart upload per Google Drive API v3 spec
    const boundary = `----borealisBoundary${Date.now()}`;
    const metadata = {
      name: data.filename,
      parents: [data.folderId],
      mimeType: data.mimeType,
    };

    const enc = (s: string) => Buffer.from(s, "utf-8");
    const body = Buffer.concat([
      enc(`--${boundary}\r\n`),
      enc(`Content-Type: application/json; charset=UTF-8\r\n\r\n`),
      enc(JSON.stringify(metadata)),
      enc(`\r\n--${boundary}\r\n`),
      enc(`Content-Type: ${data.mimeType}\r\n\r\n`),
      binary,
      enc(`\r\n--${boundary}--`),
    ]);

    const url = `${GATEWAY_BASE}/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_DRIVE_API_KEY,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(
        `Google Drive upload failed [${res.status}]: ${text.slice(0, 500)}`,
      );
    }

    const json = JSON.parse(text) as {
      id: string;
      name: string;
      webViewLink?: string;
    };
    return json;
  });
