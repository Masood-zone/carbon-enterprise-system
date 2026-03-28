import { v2 as cloudinary, type UploadApiResponse } from "cloudinary"
import { Readable } from "node:stream"

import {
  createCloudinaryPublicId,
  getCloudinaryFolder,
} from "./cloudinary-utils"

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary configuration. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    )
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })
}

configureCloudinary()

type UploadBufferArgs = {
  buffer: Buffer
  fileName: string
  folder?: string | null
}

type DeleteAssetArgs = {
  publicId: string
}

function uploadBuffer({
  buffer,
  fileName,
  folder,
}: UploadBufferArgs): Promise<UploadApiResponse> {
  const resolvedFolder = getCloudinaryFolder(folder)
  const publicId = createCloudinaryPublicId(fileName) || undefined

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: resolvedFolder,
        public_id: publicId,
        resource_type: "image",
        overwrite: true,
        unique_filename: !publicId,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"))
          return
        }

        resolve(result)
      }
    )

    Readable.from([buffer]).pipe(uploadStream)
  })
}

async function deleteAsset({ publicId }: DeleteAssetArgs): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  })

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Unable to delete Cloudinary asset: ${result.result}`)
  }
}

export const cloudinaryService = {
  uploadBuffer,
  deleteAsset,
}

export type { UploadBufferArgs, DeleteAssetArgs }