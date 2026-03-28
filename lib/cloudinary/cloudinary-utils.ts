const DEFAULT_CLOUDINARY_FOLDER = "carbon-enterprise/uploads"

export function getCloudinaryFolder(folder?: string | null): string {
  const trimmedFolder = folder?.trim()

  if (!trimmedFolder) return DEFAULT_CLOUDINARY_FOLDER

  return trimmedFolder.replace(/^\/+|\/+$/g, "")
}

export function createCloudinaryPublicId(fileName: string): string {
  const baseName = fileName.replace(/\.[^/.]+$/, "")

  return baseName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_/]+|[-_/]+$/g, "")
}

export function isAllowedImageMimeType(mimeType: string): boolean {
  return ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"].includes(
    mimeType
  )
}

export function getCloudinaryDefaultFolder() {
  return DEFAULT_CLOUDINARY_FOLDER
}