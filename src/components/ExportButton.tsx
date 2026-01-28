import { useState } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import api from '../lib/api'
import toast from 'react-hot-toast'

interface ExportButtonProps {
  endpoint: string // e.g., '/students/export/' or '/payments/export/'
  filename?: string
  filters?: Record<string, string | number | boolean>
}

export function ExportButton({ endpoint, filename, filters = {} }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'csv' | 'excel') => {
    try {
      setIsExporting(true)
      setShowMenu(false)
      
      // Show snackbar notification
      toast.loading('Download has started...', { duration: 2000 })
      
      // Build query params
      const params = new URLSearchParams({ format })
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })
      
      // Make API request for export
      const response = await api.get(`${endpoint}?${params.toString()}`, {
        responseType: 'blob'
      })
      
      // Create blob and download
      const blob = new Blob([response.data], {
        type: format === 'csv' 
          ? 'text/csv' 
          : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      
      // Extract filename from Content-Disposition header or use provided filename
      let downloadFilename = filename
      const contentDisposition = response.headers['content-disposition']
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
        if (filenameMatch) {
          downloadFilename = filenameMatch[1]
        }
      }
      
      // If still no filename, generate one
      if (!downloadFilename) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        downloadFilename = `export_${timestamp}.${format === 'csv' ? 'csv' : 'xlsx'}`
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', downloadFilename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Export completed successfully!')
    } catch (error: any) {
      console.error('Export error:', error)
      toast.error(error.response?.data?.error || 'Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        title="Export data"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
        {isExporting ? 'Exporting...' : 'Export'}
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                onClick={() => handleExport('excel')}
                disabled={isExporting}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Export as Excel (.xlsx)
              </button>
              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Export as CSV (.csv)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

