import { useState } from 'react'

export const designVariations = ['A', 'B', 'C'] as const

export type DesignVariation = (typeof designVariations)[number]

const storageKey = 'design-variation'

export const nextVariation = (current: DesignVariation): DesignVariation =>
  designVariations[(designVariations.indexOf(current) + 1) % designVariations.length]

/** Which design variation is shown, remembered per browser so a reload keeps the comparison. */
export function useDesignVariation() {
  const [variation, setVariation] = useState<DesignVariation>(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      return designVariations.find((v) => v === stored) ?? 'A'
    } catch {
      return 'A'
    }
  })

  const toggle = () =>
    setVariation((current) => {
      const next = nextVariation(current)
      try {
        localStorage.setItem(storageKey, next)
      } catch {
        // Storage unavailable (e.g. private mode); the toggle still works for this session
      }
      return next
    })

  return { variation, toggle }
}
