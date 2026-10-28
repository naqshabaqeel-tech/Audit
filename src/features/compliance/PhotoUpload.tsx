import { useRef } from 'react'
import uploadIcon from '../../assets/icons/upload.svg'
import xIcon from '../../assets/icons/x.svg'

type PhotoUploadProps = {
  photos: string[]
  onChange: (photos: string[]) => void
}

/** Upload tile plus thumbnails with remove buttons, shared by promotions and programs */
export function PhotoUpload({ photos, onChange }: PhotoUploadProps) {
  const fileInput = useRef<HTMLInputElement>(null)

  const addPhotos = (files: FileList | null) => {
    if (!files?.length) return
    onChange([...photos, ...Array.from(files, (file) => URL.createObjectURL(file))])
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        aria-label="Upload photo"
        onClick={() => fileInput.current?.click()}
        className="flex size-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100"
      >
        <span className="flex size-8 items-center justify-center rounded-lg border border-gray-100">
          <img src={uploadIcon} alt="" width={20} height={20} />
        </span>
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          addPhotos(event.target.files)
          event.target.value = ''
        }}
      />
      <ul className="flex flex-wrap items-center gap-6">
        {photos.map((photo, index) => (
          <li key={`${photo}-${index}`} className="relative size-20 rounded-lg bg-gray-50">
            <img src={photo} alt={`Photo ${index + 1}`} className="size-full rounded-lg border border-gray-200 object-cover" />
            <button
              type="button"
              aria-label={`Remove photo ${index + 1}`}
              onClick={() => onChange(photos.filter((_, i) => i !== index))}
              className="absolute top-[-14px] left-[65px] flex size-7 cursor-pointer items-center justify-center rounded-full bg-primary-100"
            >
              <img src={xIcon} alt="" width={16} height={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
