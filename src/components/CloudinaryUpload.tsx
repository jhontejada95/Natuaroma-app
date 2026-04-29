'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'

declare global {
  interface Window {
    cloudinary: any
  }
}

interface CloudinaryUploadProps {
  defaultValue?: string
  name?: string
}

export function CloudinaryUpload({ defaultValue = '', name = 'image_url' }: CloudinaryUploadProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue)
  const [loading, setLoading] = useState(false)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    // Load Cloudinary Upload Widget script
    const script = document.createElement('script')
    script.src = 'https://upload-widget.cloudinary.com/global/all.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  function openWidget() {
    if (!window.cloudinary) return
    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          folder: 'natuaroma/products',
          sources: ['local', 'url', 'camera'],
          multiple: false,
          cropping: false,
          showAdvancedOptions: false,
          defaultSource: 'local',
          styles: {
            palette: {
              window: '#1a1a2e',
              windowBorder: '#3d5a3e',
              tabIcon: '#5c8a5e',
              menuIcons: '#9aad9b',
              textDark: '#f0f0f0',
              textLight: '#f0f0f0',
              link: '#5c8a5e',
              action: '#3d5a3e',
              inactiveTabIcon: '#9aad9b',
              error: '#cc0000',
              inProgress: '#5c8a5e',
              complete: '#33ff00',
              sourceBg: '#13131d',
            },
          },
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            setImageUrl(result.info.secure_url)
            setLoading(false)
          }
          if (error) {
            console.error('Cloudinary upload error:', error)
            setLoading(false)
          }
        }
      )
    }
    setLoading(true)
    widgetRef.current.open()
  }

  function clearImage() {
    setImageUrl('')
    widgetRef.current = null
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={imageUrl} />

      {imageUrl ? (
        <div className="relative w-full max-w-xs group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Imagen del producto"
            className="w-full aspect-square object-cover rounded-xl border border-outline-variant"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            title="Eliminar imagen"
          >
            <X size={14} />
          </button>
          <button
            type="button"
            onClick={openWidget}
            className="mt-2 flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg text-sm text-foreground/70 hover:text-primary hover:border-primary transition-colors"
          >
            <Upload size={14} />
            Cambiar imagen
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openWidget}
          disabled={loading}
          className="w-full max-w-xs aspect-square border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-3 text-foreground/50 hover:text-primary hover:border-primary transition-colors disabled:opacity-60 disabled:cursor-wait"
        >
          {loading ? (
            <>
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm">Abriendo...</span>
            </>
          ) : (
            <>
              <ImageIcon size={32} className="opacity-40" />
              <div className="text-center">
                <p className="text-sm font-medium">Subir imagen</p>
                <p className="text-xs mt-0.5 opacity-70">JPG, PNG, WebP · hasta 10 MB</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                <Upload size={12} />
                Seleccionar archivo
              </div>
            </>
          )}
        </button>
      )}
    </div>
  )
}
