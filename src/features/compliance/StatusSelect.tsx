import { useEffect, useId, useRef, useState } from 'react'
import caretDownIcon from '../../assets/icons/caret-down.svg'
import checkCircleIcon from '../../assets/icons/check-circle.svg'
import xCircleIcon from '../../assets/icons/x-circle.svg'
import type { PromotionStatus } from './data'

export type MarkStatus = Exclude<PromotionStatus, 'open'>

const statusStyles: Record<PromotionStatus, { label: string; icon?: string; classes: string }> = {
  open: { label: 'Open', classes: 'border-primary-100 bg-primary-50 text-primary-700' },
  compliant: {
    label: 'Compliant',
    icon: checkCircleIcon,
    classes: 'border-success-100 bg-success-50 text-success-700',
  },
  'not-compliant': {
    label: 'Not Compliant',
    icon: xCircleIcon,
    classes: 'border-warning-100 bg-warning-50 text-warning-600',
  },
}

const options: PromotionStatus[] = ['open', 'compliant', 'not-compliant']

type StatusSelectProps = {
  /** Undefined means the promotion hasn't been marked, shown as "Open" */
  value?: MarkStatus
  /** Choosing "Open" un-marks the promotion and reports `undefined` */
  onChange: (status: MarkStatus | undefined) => void
  'aria-labelledby'?: string
}

/** Status picker whose menu opens upwards, for use in footers. Unmarked promotions read as "Open". */
export function StatusSelect({ value, onChange, 'aria-labelledby': labelledBy }: StatusSelectProps) {
  const [open, setOpen] = useState(false)
  // Keyboard highlight; -1 = none, so opening with the mouse only shows the selected option
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listId = useId()
  const currentStatus: PromotionStatus = value ?? 'open'
  const current = statusStyles[currentStatus]

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const openMenu = (fromKeyboard = false) => {
    setActiveIndex(fromKeyboard ? options.indexOf(currentStatus) : -1)
    setOpen(true)
  }

  const choose = (status: PromotionStatus) => {
    onChange(status === 'open' ? undefined : status)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (['ArrowUp', 'ArrowDown', 'Enter', ' '].includes(event.key)) {
        event.preventDefault()
        openMenu(true)
      }
      return
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        break
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((i) => (i < 0 ? 0 : (i + 1) % options.length))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((i) => (i <= 0 ? options.length - 1 : i - 1))
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (activeIndex >= 0) choose(options[activeIndex])
        break
      case 'Tab':
        setOpen(false)
        break
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelledBy}
        aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${options[activeIndex]}` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2 text-xs font-medium transition-colors ${current.classes}`}
      >
        {current.icon && <img src={current.icon} alt="" width={16} height={16} />}
        <span className="flex items-center gap-1">
          {current.label}
          <img
            src={caretDownIcon}
            alt=""
            width={12}
            height={12}
            className={`transition-transform ${open ? '' : 'rotate-180'}`}
          />
        </span>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          onPointerLeave={() => setActiveIndex(-1)}
          aria-labelledby={labelledBy}
          className="absolute bottom-full left-0 z-30 mb-1 flex w-max min-w-full flex-col gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
        >
          {options.map((status, index) => {
            const option = statusStyles[status]
            const isSelected = status === currentStatus
            return (
              <li
                key={status}
                id={`${listId}-${status}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => choose(status)}
                className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-2 text-xs font-medium whitespace-nowrap ${
                  isSelected
                    ? option.classes
                    : `border-transparent text-gray-700 ${index === activeIndex ? 'bg-gray-50' : ''}`
                }`}
              >
                {/* Open has no icon; keep its label aligned with the others */}
                {option.icon ? <img src={option.icon} alt="" width={16} height={16} /> : <span className="size-4" />}
                {option.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
