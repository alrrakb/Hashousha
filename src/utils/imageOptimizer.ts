/**
 * Luxury In-Browser Image Optimization & WebP Encoding Pipeline
 * HASHOUSHA Engineering & Luxury Operations
 *
 * Capabilities:
 * - Dynamic on-demand HEIC/HEIF decoding via heic2any
 * - High-fidelity proportional Canvas resizing with bicubic smoothing
 * - High-efficiency WebP compression (70% - 92% typical savings)
 * - Zero external server latency & graceful fallback resiliency
 */

export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'image/webp'
}

export interface OptimizationResult {
  file: File
  originalSize: number
  optimizedSize: number
  savingsPercent: number
  width: number
  height: number
  previewUrl: string
}

export const OPTIMIZER_PRESETS: Record<string, Required<ImageOptimizationOptions>> = {
  dish: { maxWidth: 1400, maxHeight: 1400, quality: 0.84, format: 'image/webp' },
  hero: { maxWidth: 1920, maxHeight: 1080, quality: 0.85, format: 'image/webp' },
  logo: { maxWidth: 800, maxHeight: 800, quality: 0.90, format: 'image/webp' },
  favicon: { maxWidth: 128, maxHeight: 128, quality: 0.90, format: 'image/webp' },
}

/**
 * Format bytes into human-readable string (e.g. 1.2 MB, 145 KB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Checks if a file is an Apple HEIC/HEIF container
 */
export function isHeicFile(file: File | Blob, fileName?: string): boolean {
  const name = fileName || (file instanceof File ? file.name : '')
  const ext = name.toLowerCase().split('.').pop()
  return (
    ext === 'heic' ||
    ext === 'heif' ||
    file.type.toLowerCase().includes('heic') ||
    file.type.toLowerCase().includes('heif')
  )
}

/**
 * Decodes an Apple HEIC/HEIF Blob to JPEG via dynamic on-demand import of heic2any
 */
async function decodeHeicToJpeg(file: Blob): Promise<Blob> {
  const heic2any = (await import('heic2any')).default
  const converted = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.92,
  })

  if (Array.isArray(converted)) {
    return converted[0]
  }
  return converted
}

/**
 * Loads a Blob or File into an HTMLImageElement
 */
function loadImageElement(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(new Error(`Failed to load image in browser: ${err}`))
    }
    img.src = url
  })
}

/**
 * Optimizes any user-uploaded image (PNG, JPG, JPEG, HEIC, WEBP) to WebP in the browser
 */
export async function optimizeImageToWebp(
  inputFile: File,
  options?: ImageOptimizationOptions
): Promise<OptimizationResult> {
  const originalSize = inputFile.size
  const originalName = inputFile.name

  const maxWidth = options?.maxWidth ?? 1400
  const maxHeight = options?.maxHeight ?? 1400
  const quality = options?.quality ?? 0.84

  try {
    let sourceBlob: Blob = inputFile

    // 1. Dynamic HEIC / HEIF transcoding if needed
    if (isHeicFile(inputFile)) {
      try {
        sourceBlob = await decodeHeicToJpeg(inputFile)
      } catch (heicErr) {
        console.warn('HEIC transcoding warning:', heicErr)
        // Fallback to original blob if heic2any fails
        sourceBlob = inputFile
      }
    }

    // 2. Load into HTMLImageElement
    const img = await loadImageElement(sourceBlob)
    const originalWidth = img.naturalWidth || img.width
    const originalHeight = img.naturalHeight || img.height

    if (!originalWidth || !originalHeight) {
      throw new Error('Invalid image dimensions')
    }

    // 3. Proportional Bounding Box Computation
    const ratio = Math.min(1, maxWidth / originalWidth, maxHeight / originalHeight)
    const targetWidth = Math.max(1, Math.round(originalWidth * ratio))
    const targetHeight = Math.max(1, Math.round(originalHeight * ratio))

    // 4. Render to Canvas with High Smoothing Quality
    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas 2D context is unavailable')
    }

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

    // 5. Encode to WebP Blob
    const webpBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b),
        'image/webp',
        quality
      )
    })

    if (!webpBlob) {
      throw new Error('Canvas toBlob encoding failed')
    }

    // 6. Wrap in File object
    const cleanBaseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_')
    const finalFileName = `${cleanBaseName || 'image'}.webp`
    const optimizedFile = new File([webpBlob], finalFileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    })

    const optimizedSize = optimizedFile.size
    const savingsPercent = Math.max(
      0,
      Math.round(((originalSize - optimizedSize) / originalSize) * 100)
    )

    const previewUrl = URL.createObjectURL(optimizedFile)

    return {
      file: optimizedFile,
      originalSize,
      optimizedSize,
      savingsPercent,
      width: targetWidth,
      height: targetHeight,
      previewUrl,
    }
  } catch (error) {
    console.error('In-browser image optimization fell back to original file:', error)
    // Fallback gracefully without breaking upload flow
    const fallbackPreviewUrl = URL.createObjectURL(inputFile)
    return {
      file: inputFile,
      originalSize,
      optimizedSize: originalSize,
      savingsPercent: 0,
      width: 0,
      height: 0,
      previewUrl: fallbackPreviewUrl,
    }
  }
}
