export function getVideoPoster(url: string): string {
  return url
    .replace("/upload/", "/upload/so_auto/")
    .replace(/\.(mp4|mov|webm|ogg|avi|mkv)$/i, ".jpg");
}
