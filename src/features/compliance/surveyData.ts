import type { BadgeTone } from '../../components/Badge'

/** A survey item stays `open` until its store price is saved. */
export type SurveyStatus = 'open' | 'collected'

export const surveyStatusBadge: Record<SurveyStatus, { label: string; tone: BadgeTone }> = {
  open: { label: 'Open', tone: 'info' },
  collected: { label: 'Collected', tone: 'success' },
}

export type SurveyCategory = {
  id: string
  name: string
}

export type SurveyItem = {
  id: string
  categoryId: string
  name: string
  /** What the auditor is asked to collect, e.g. "Shelf price · 20oz bottle" */
  ask: string
}

export type SurveyAnswer = {
  price: string
  description: string
}

export const surveyCategories: SurveyCategory[] = [
  { id: 'retail-price', name: 'Retail Price' },
  { id: 'equipment', name: 'Equipment' },
]

export const surveyItems: SurveyItem[] = [
  { id: 'rp-1', categoryId: 'retail-price', name: 'Coca-Cola Classic', ask: 'Shelf price · 20oz bottle' },
  { id: 'rp-2', categoryId: 'retail-price', name: 'Pepsi', ask: 'Shelf price · 20oz bottle' },
  { id: 'rp-3', categoryId: 'retail-price', name: 'Monster Energy', ask: 'Shelf price · 16oz can' },
  { id: 'rp-4', categoryId: 'retail-price', name: 'Red Bull', ask: 'Shelf price · 8.4oz can' },
  { id: 'rp-5', categoryId: 'retail-price', name: 'Gatorade Cool Blue', ask: 'Shelf price · 28oz bottle' },
  { id: 'rp-6', categoryId: 'retail-price', name: 'Doritos Nacho Cheese', ask: 'Shelf price · 9.25oz bag' },
  { id: 'eq-1', categoryId: 'equipment', name: 'Glass-door cooler (2-door)', ask: 'Monthly rental price' },
  { id: 'eq-2', categoryId: 'equipment', name: 'Fountain dispenser', ask: 'Monthly service fee' },
  { id: 'eq-3', categoryId: 'equipment', name: 'Ice merchandiser', ask: 'Monthly rental price' },
  { id: 'eq-4', categoryId: 'equipment', name: 'Coffee brewer', ask: 'Purchase price' },
]

export const formatPrice = (value: string) => (value === '' || value === '.' ? '' : Number(value).toFixed(2))
