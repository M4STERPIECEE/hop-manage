const MIME_BY_PREFIX: Record<string, string> = {
  iVBOR: "image/png",
  "/9j/": "image/jpeg",
  R0lG: "image/gif",
  UklGR: "image/webp",
};

export function base64ToDataUrl(b64: string): string {
  for (const prefix in MIME_BY_PREFIX) {
    if (b64.startsWith(prefix)) {
      return `data:${MIME_BY_PREFIX[prefix]};base64,${b64}`;
    }
  }
  return `data:image/png;base64,${b64}`;
}

export function dataUrlToBase64(dataUrl: string): string {
  const idx = dataUrl.indexOf("base64,");
  return idx !== -1 ? dataUrl.slice(idx + 7) : dataUrl;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
