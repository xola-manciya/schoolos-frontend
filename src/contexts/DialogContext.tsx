import { createContext, useContext, useState, ReactNode } from 'react'
import Dialog, { DialogConfig } from '../components/Dialog'

interface DialogContextType {
  alert: (message: string, title?: string) => Promise<void>
  confirm: (message: string, title?: string) => Promise<boolean>
  info: (message: string, title?: string) => Promise<void>
  success: (message: string, title?: string) => Promise<void>
  warning: (message: string, title?: string) => Promise<void>
  error: (message: string, title?: string) => Promise<void>
  showDialog: (config: DialogConfig) => Promise<boolean>
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<DialogConfig>({ message: '' })
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null)

  const showDialog = (dialogConfig: DialogConfig): Promise<boolean> => {
    setConfig(dialogConfig)
    setIsOpen(true)

    return new Promise((resolve) => {
      setResolver(() => resolve)
    })
  }

  const handleClose = () => {
    setIsOpen(false)
    if (resolver) {
      resolver(false)
      setResolver(null)
    }
  }

  const handleConfirm = async () => {
    if (config.onConfirm) {
      await config.onConfirm()
    }
    setIsOpen(false)
    if (resolver) {
      resolver(true)
      setResolver(null)
    }
  }

  const alert = (message: string, title?: string): Promise<void> => {
    return showDialog({
      type: 'alert',
      message,
      title,
    }).then(() => {})
  }

  const confirm = (message: string, title?: string): Promise<boolean> => {
    return showDialog({
      type: 'confirm',
      message,
      title,
    })
  }

  const info = (message: string, title?: string): Promise<void> => {
    return showDialog({
      type: 'info',
      message,
      title,
    }).then(() => {})
  }

  const success = (message: string, title?: string): Promise<void> => {
    return showDialog({
      type: 'success',
      message,
      title,
    }).then(() => {})
  }

  const warning = (message: string, title?: string): Promise<void> => {
    return showDialog({
      type: 'warning',
      message,
      title,
    }).then(() => {})
  }

  const error = (message: string, title?: string): Promise<void> => {
    return showDialog({
      type: 'error',
      message,
      title,
    }).then(() => {})
  }

  const modifiedConfig = {
    ...config,
    onConfirm: handleConfirm,
    onCancel: handleClose,
  }

  return (
    <DialogContext.Provider value={{ alert, confirm, info, success, warning, error, showDialog }}>
      {children}
      <Dialog isOpen={isOpen} config={modifiedConfig} onClose={handleClose} />
    </DialogContext.Provider>
  )
}

export function useDialog() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider')
  }
  return context
}
