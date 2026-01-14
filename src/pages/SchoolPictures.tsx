import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  PhotoIcon,
  TrashIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import api from '../lib/api'
import { ExportButton } from '../components/ExportButton'

interface SchoolPicture {
  id: number
  title: string
  description: string
  original_url: string
  medium_url: string
  thumbnail_url: string
  original_width: number
  original_height: number
  file_size: number
  uploaded_by_name: string
  uploaded_at: string
}

export default function SchoolPictures() {
  const [selectedImage, setSelectedImage] = useState<SchoolPicture | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  // Fetch pictures
  const { data: pictures = [], isLoading } = useQuery<SchoolPicture[]>({
    queryKey: ['school-pictures'],
    queryFn: async () => {
      const response = await api.get('/general/pictures/')
      return response.data
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/general/pictures/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-pictures'] })
    },
  })

  // Upload handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i])
    }

    try {
      await api.post('/general/pictures/bulk-upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0
          setUploadProgress(progress)
        },
      })

      queryClient.invalidateQueries({ queryKey: ['school-pictures'] })
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
      e.target.value = '' // Reset input
    }
  }

  // Filter pictures by search query
  const filteredPictures = pictures.filter(
    (pic) =>
      pic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pic.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Pictures</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload and manage your school's photo gallery
          </p>
        </div>
        <div className="flex gap-3">
          <ExportButton
            data={pictures}
            filename="school-pictures"
          />
          <label className="cursor-pointer rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
            <CloudArrowUpIcon className="mr-2 inline-block h-5 w-5" />
            Upload Pictures
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Uploading...</span>
            <span className="text-gray-500">{uploadProgress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-primary-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search pictures by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      {/* Pictures Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      ) : filteredPictures.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pictures</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? 'No pictures match your search'
              : 'Get started by uploading your first picture'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPictures.map((picture) => (
            <div
              key={picture.id}
              className="group relative overflow-hidden rounded-lg bg-white shadow transition-transform hover:scale-105"
            >
              {/* Thumbnail */}
              <div
                className="aspect-square cursor-pointer bg-gray-200"
                onClick={() => setSelectedImage(picture)}
              >
                <img
                  src={picture.thumbnail_url}
                  alt={picture.title || 'School picture'}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Info Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <h3 className="text-sm font-medium text-white">
                  {picture.title || 'Untitled'}
                </h3>
                <p className="text-xs text-gray-300">
                  {formatDate(picture.uploaded_at)}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Delete this picture?')) {
                    deleteMutation.mutate(picture.id)
                  }
                }}
                className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-700 group-hover:opacity-100"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div
            className="max-h-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.medium_url}
              alt={selectedImage.title || 'School picture'}
              className="max-h-[80vh] w-full rounded-lg object-contain"
            />

            {/* Image Info */}
            <div className="mt-4 rounded-lg bg-white p-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedImage.title || 'Untitled'}
              </h2>
              {selectedImage.description && (
                <p className="mt-1 text-sm text-gray-600">
                  {selectedImage.description}
                </p>
              )}
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Uploaded by:</span>{' '}
                  {selectedImage.uploaded_by_name}
                </div>
                <div>
                  <span className="font-medium">Date:</span>{' '}
                  {formatDate(selectedImage.uploaded_at)}
                </div>
                <div>
                  <span className="font-medium">Dimensions:</span>{' '}
                  {selectedImage.original_width} × {selectedImage.original_height}
                </div>
                <div>
                  <span className="font-medium">Size:</span>{' '}
                  {formatFileSize(selectedImage.file_size)}
                </div>
              </div>
              <div className="mt-4">
                <a
                  href={selectedImage.original_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Download Original
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
