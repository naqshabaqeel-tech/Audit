import { nextVariation, type DesignVariation } from './useDesignVariation'

type VariationToggleProps = {
  variation: DesignVariation
  onToggle: () => void
}

export function VariationToggle({ variation, onToggle }: VariationToggleProps) {
  const next = nextVariation(variation)
  return (
    <button
      type="button"
      onClick={onToggle}
      title={`Showing variation ${variation} — switch to ${next}`}
      aria-label={`Design variation ${variation}. Switch to variation ${next}`}
      className="flex size-9 cursor-pointer flex-col items-center justify-center rounded-full bg-primary-500 text-white shadow-lg ring-4 ring-white transition-colors hover:bg-primary-600"
    >
      <span className="text-[8px] leading-none font-medium tracking-wide uppercase opacity-80">Var</span>
      <span className="text-sm leading-none font-semibold">{variation}</span>
    </button>
  )
}
