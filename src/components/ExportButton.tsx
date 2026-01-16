import { useState } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import * as XLSX from 'xlsx'
import { useAuthStore } from '../store/authStore'

interface ExportButtonProps {
  data: any[]
  filename: string
  headers?: string[]
}

export function ExportButton({ data, filename, headers }: ExportButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const user = useAuthStore((state) => state.user)
  
  // Check if user is on trial
  const isTrial = user?.is_trial || false

  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('No data to export')
      return
    }

    // Get headers from first object if not provided
    const csvHeaders = headers || Object.keys(data[0])
    
    // Create CSV content
    const csvContent = [
      csvHeaders.join(','), // Header row
      ...data.map((row) =>
        csvHeaders.map((header) => {
          const value = row[header] || ''
          // Escape quotes and wrap in quotes if contains comma
          const escaped = String(value).replace(/"/g, '""')
          return escaped.includes(',') ? `"${escaped}"` : escaped
        }).join(',')
      ),
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowMenu(false)
  }

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert('No data to export')
      return
    }

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    // Generate Excel file
    XLSX.writeFile(wb, `${filename}.xlsx`)
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (isTrial) {
            alert('Export functionality is not available during the trial period. Please upgrade to a paid plan.')
            return
          }
          setShowMenu(!showMenu)
        }}
        disabled={isTrial}
        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          isTrial
            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
        title={isTrial ? 'Export not available during trial' : 'Export data'}
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
        Export {isTrial && '(Trial)'}
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
                onClick={exportToExcel}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Export as Excel (.xlsx)
              </button>
              <button
                onClick={exportToCSV}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
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

// Hook version for programmatic exports
export function useExport() {
  const exportToCSV = (data: any[], filename: string, headers?: string[]) => {
    if (!data || data.length === 0) {
      console.error('No data to export')
      return
    }

    const csvHeaders = headers || Object.keys(data[0])
    const csvContent = [
      csvHeaders.join(','),
      ...data.map((row) =>
        csvHeaders.map((header) => {
          const value = row[header] || ''
          const escaped = String(value).replace(/"/g, '""')
          return escaped.includes(',') ? `"${escaped}"` : escaped
        }).join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      console.error('No data to export')
      return
    }

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, `${filename}.xlsx`)
  }

  return { exportToCSV, exportToExcel }
}
