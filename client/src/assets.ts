// Vite automatically discovers image files placed inside src/assets.
// Update only the filenames in data.ts if your downloaded files use different names.
const files = import.meta.glob("./assets/**/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function asset(filename: string) {
  const match = Object.entries(files).find(([path]) =>
    path.toLowerCase().endsWith(`/${filename.toLowerCase()}`)
  );

  return match?.[1] ?? `/assets/${filename}`;
}
