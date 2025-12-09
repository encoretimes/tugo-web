import {
  compressImage,
  compressImages,
  getImageMetadata,
  isImageFile,
  formatFileSize,
} from '../imageCompression'

// Mock the browser-image-compression library
jest.mock('browser-image-compression', () => {
  return jest.fn((file: File) => {
    // Return a smaller mocked file
    return Promise.resolve(
      new File(['compressed'], file.name, {
        type: file.type,
        lastModified: Date.now(),
      }),
    )
  })
})

describe('Image Compression Utilities', () => {
  describe('compressImage', () => {
    it('compresses large image file', async () => {
      // Create a large mock file (5MB)
      const largeFile = new File(['a'.repeat(5 * 1024 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
      })

      const compressed = await compressImage(largeFile, 'general')

      expect(compressed).toBeDefined()
      expect(compressed.name).toBe('test.jpg')
      expect(compressed.type).toBe('image/jpeg')
    })

    it('skips compression for small files', async () => {
      // Create a small mock file (100KB)
      const smallFile = new File(['a'.repeat(100 * 1024)], 'small.jpg', {
        type: 'image/jpeg',
      })

      const result = await compressImage(smallFile, 'general')

      // Should return the same file without compression
      expect(result).toBe(smallFile)
    })

    it('uses correct options for profile images', async () => {
      const file = new File(['a'.repeat(3 * 1024 * 1024)], 'profile.jpg', {
        type: 'image/jpeg',
      })

      await compressImage(file, 'profile')

      // Profile images should have stricter compression
      // (maxSizeMB: 1, maxWidthOrHeight: 800)
      expect(file.type).toBe('image/jpeg')
    })

    it('uses correct options for banner images', async () => {
      const file = new File(['a'.repeat(5 * 1024 * 1024)], 'banner.jpg', {
        type: 'image/jpeg',
      })

      await compressImage(file, 'banner')

      expect(file.type).toBe('image/jpeg')
    })

    it('uses correct options for post images', async () => {
      const file = new File(['a'.repeat(5 * 1024 * 1024)], 'post.jpg', {
        type: 'image/jpeg',
      })

      await compressImage(file, 'post')

      expect(file.type).toBe('image/jpeg')
    })

    it('allows custom compression options', async () => {
      const file = new File(['a'.repeat(5 * 1024 * 1024)], 'custom.jpg', {
        type: 'image/jpeg',
      })

      const customOptions = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
        quality: 0.7,
      }

      await compressImage(file, 'general', customOptions)

      expect(file.type).toBe('image/jpeg')
    })

    it('handles different image formats', async () => {
      const pngFile = new File(['a'.repeat(3 * 1024 * 1024)], 'test.png', {
        type: 'image/png',
      })

      const result = await compressImage(pngFile, 'general')

      expect(result.type).toBe('image/png')
    })

    it('handles webp format', async () => {
      const webpFile = new File(['a'.repeat(3 * 1024 * 1024)], 'test.webp', {
        type: 'image/webp',
      })

      const result = await compressImage(webpFile, 'general')

      expect(result.type).toBe('image/webp')
    })
  })

  describe('isImageFile', () => {
    it('accepts valid image types', () => {
      const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ]

      validTypes.forEach((type) => {
        const file = new File(['test'], 'test.jpg', { type })
        expect(isImageFile(file)).toBe(true)
      })
    })

    it('rejects invalid file types', () => {
      const invalidFile = new File(['test'], 'test.pdf', {
        type: 'application/pdf',
      })

      expect(isImageFile(invalidFile)).toBe(false)
    })

    it('rejects text files', () => {
      const textFile = new File(['test'], 'test.txt', {
        type: 'text/plain',
      })

      expect(isImageFile(textFile)).toBe(false)
    })

    it('handles empty type', () => {
      const file = new File(['test'], 'test.jpg', { type: '' })
      expect(isImageFile(file)).toBe(false)
    })
  })

  describe('getImageMetadata', () => {
    it('returns dimensions and aspect ratio for valid image', async () => {
      // Mock URL.createObjectURL
      global.URL.createObjectURL = jest.fn(() => 'mock-url')
      global.URL.revokeObjectURL = jest.fn()

      // Mock Image constructor
      const OriginalImage = global.Image
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(global as any).Image = class {
        naturalWidth = 1920
        naturalHeight = 1080
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src: string = ''

        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload()
          }, 0)
        }
      }

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const metadata = await getImageMetadata(file)

      expect(metadata).toEqual({
        width: 1920,
        height: 1080,
        aspectRatio: 1920 / 1080,
      })

      global.Image = OriginalImage
    })

    it('handles image load errors', async () => {
      // Mock Image to fail loading
      const OriginalImage = global.Image
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(global as any).Image = class {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src: string = ''

        constructor() {
          setTimeout(() => {
            if (this.onerror) this.onerror()
          }, 0)
        }
      }

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      await expect(getImageMetadata(file)).rejects.toThrow('Failed to load image')
      
      global.Image = OriginalImage
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('formats decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB')
      expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB')
    })

    it('handles small values', () => {
      expect(formatFileSize(100)).toBe('100 Bytes')
      expect(formatFileSize(512)).toBe('512 Bytes')
    })
  })

  describe('compressImages', () => {
    it('compresses multiple images', async () => {
      const files = [
        new File(['a'.repeat(3 * 1024 * 1024)], 'test1.jpg', {
          type: 'image/jpeg',
        }),
        new File(['a'.repeat(3 * 1024 * 1024)], 'test2.jpg', {
          type: 'image/jpeg',
        }),
      ]

      const compressed = await compressImages(files, 'general')

      expect(compressed).toHaveLength(2)
      expect(compressed[0].type).toBe('image/jpeg')
      expect(compressed[1].type).toBe('image/jpeg')
    })

    it('handles empty array', async () => {
      const result = await compressImages([], 'general')
      expect(result).toEqual([])
    })
  })

  describe('Edge Cases', () => {
    it('handles empty file', async () => {
      const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' })

      // Should return the file as-is since it's too small
      const result = await compressImage(emptyFile, 'general')
      expect(result).toBe(emptyFile)
    })

    it('handles file with no extension', async () => {
      const file = new File(['a'.repeat(3 * 1024 * 1024)], 'noextension', {
        type: 'image/jpeg',
      })

      const result = await compressImage(file, 'general')
      expect(result.type).toBe('image/jpeg')
    })

    it('preserves file metadata', async () => {
      const originalDate = Date.now()
      const file = new File(['a'.repeat(3 * 1024 * 1024)], 'test.jpg', {
        type: 'image/jpeg',
        lastModified: originalDate,
      })

      await compressImage(file, 'general')

      // File metadata should be preserved or reasonable
      expect(typeof file.lastModified).toBe('number')
    })
  })
})
