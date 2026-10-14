import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import type { Promotion, Vendor } from './data'

type AddPromotionDialogProps = {
  open: boolean
  vendors: Vendor[]
  /** Promotions that can still be added (not ordered and not already in the audit) */
  available: Promotion[]
  onAdd: (ids: string[]) => void
  onClose: () => void
}

export function AddPromotionDialog({ open, vendors, available, onAdd, onClose }: AddPromotionDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [query, setQuery] = useState('')
  const [vendorFilter, setVendorFilter] = useState<string | null>(null)
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [wasOpen, setWasOpen] = useState(open)

  // Start each visit to the dialog with a clean slate
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setQuery('')
      setVendorFilter(null)
      setPicked(new Set())
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const vendorNames = useMemo(() => new Map(vendors.map((v) => [v.id, v.name])), [vendors])
  const vendorsWithOptions = vendors.filter((v) => available.some((p) => p.vendorId === v.id))

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    return available.filter(
      (p) =>
        (!vendorFilter || p.vendorId === vendorFilter) &&
        (!term || `${p.name} ${p.offer} ${vendorNames.get(p.vendorId)}`.toLowerCase().includes(term)),
    )
  }, [available, query, vendorFilter, vendorNames])

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const chip = (active: boolean) =>
    `flex h-8 shrink-0 cursor-pointer items-center rounded-lg border px-3 text-sm font-medium ${
      active ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
    }`

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
      aria-labelledby="add-promotion-title"
      className="m-auto flex max-h-[min(640px,85dvh)] w-[min(560px,calc(100%-32px))] flex-col rounded-lg border border-gray-200 bg-white p-0 text-gray-800 shadow-lg backdrop:bg-black/20 [&:not([open])]:hidden"
    >
      <header className="flex flex-col gap-1 px-6 pt-5 pb-3">
        <h2 id="add-promotion-title" className="text-base font-semibold text-gray-900">
          Add promotions not ordered
        </h2>
        <p className="text-sm text-gray-500">
          Select promotions found in store that weren’t part of this location’s order.
        </p>
      </header>

      <div className="flex flex-col gap-3 border-b border-gray-100 px-6 pb-4">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search promotions"
          aria-label="Search promotions not ordered"
          className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by vendor">
          <button type="button" aria-pressed={!vendorFilter} onClick={() => setVendorFilter(null)} className={chip(!vendorFilter)}>
            All vendors
          </button>
          {vendorsWithOptions.map((vendor) => (
            <button
              key={vendor.id}
              type="button"
              aria-pressed={vendorFilter === vendor.id}
              onClick={() => setVendorFilter(vendor.id)}
              className={chip(vendorFilter === vendor.id)}
            >
              {vendor.name}
            </button>
          ))}
        </div>
      </div>

      <ul className="min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto">
        {results.length === 0 && (
          <li className="px-6 py-8 text-center text-sm text-gray-500">
            {available.length === 0 ? 'All available promotions have been added.' : 'No promotions match your search.'}
          </li>
        )}
        {results.map((promotion) => (
          <li key={promotion.id}>
            <label className="flex cursor-pointer items-center gap-3 px-6 py-3 hover:bg-gray-50">
              <input
                type="checkbox"
                checked={picked.has(promotion.id)}
                onChange={() => toggle(promotion.id)}
                className="size-4 shrink-0 cursor-pointer accent-primary-500"
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-base font-medium text-gray-800">{promotion.name}</span>
                <span className="truncate text-sm text-gray-500">
                  {vendorNames.get(promotion.vendorId)} · {promotion.offer}
                </span>
              </span>
            </label>
          </li>
        ))}
      </ul>

      <footer className="flex items-center justify-end gap-2 border-t border-gray-100 px-6 py-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={picked.size === 0} onClick={() => onAdd([...picked])}>
          {picked.size > 1 ? `Add ${picked.size} promotions` : 'Add promotion'}
        </Button>
      </footer>
    </dialog>
  )
}
