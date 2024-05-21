import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Encode multi-part form data as specified in RFC 7578.
 */
export function encodeFormData(filename: string, contentType: string, buffer: Buffer) {
  if (!/^[A-Za-z0-9_.-]+$/.test(filename))
    throw Error(`Bad filename: ${filename}`)

  let boundary
  while (!boundary || buffer.includes(boundary)) {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    boundary = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  let boundaryBuffer = Buffer.concat([
    Buffer.from("--"),
    Buffer.from(boundary)])

  let headerBuffer = Buffer.concat([
    Buffer.from('Content-Disposition: form-data; name="file";' +
                ` filename="${filename}"\r\n`),
    Buffer.from(`Content-Type: ${contentType}\r\n`),
    Buffer.from("\r\n")])

  let body = Buffer.concat([
    boundaryBuffer,
    Buffer.from("\r\n"),
    headerBuffer,
    buffer,
    Buffer.from("\r\n"),
    boundaryBuffer,
    Buffer.from("--\r\n")])

  return {
    contentType: `multipart/form-data; boundary=${boundary}`,
    body,
  }
}