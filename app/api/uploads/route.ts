import { NextResponse } from "next/server"

import { cloudinaryService } from "@/lib/cloudinary/cloudinary-service"
import {
  createCloudinaryPublicId,
  getCloudinaryFolder,
  isAllowedImageMimeType,
} from "@/lib/cloudinary/cloudinary-utils"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const fileValue = formData.get("file")

    if (!(fileValue instanceof File)) {
      return NextResponse.json(
        { error: "A file field is required" },
        { status: 400 }
      )
    }

    if (!isAllowedImageMimeType(fileValue.type)) {
      return NextResponse.json(
        { error: "Only image uploads are supported" },
        { status: 415 }
      )
    }

    const folderValue = formData.get("folder")
    const folder =
      typeof folderValue === "string" ? getCloudinaryFolder(folderValue) : undefined

    const buffer = Buffer.from(await fileValue.arrayBuffer())
    const uploadResult = await cloudinaryService.uploadBuffer({
      buffer,
      fileName: createCloudinaryPublicId(fileValue.name) || fileValue.name,
      folder,
    })

    return NextResponse.json({
      assetId: uploadResult.asset_id,
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const publicId = url.searchParams.get("publicId")

    if (!publicId) {
      return NextResponse.json(
        { error: "publicId query param is required" },
        { status: 400 }
      )
    }

    await cloudinaryService.deleteAsset({ publicId })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}