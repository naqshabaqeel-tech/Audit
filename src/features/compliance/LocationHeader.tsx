import caretDownIcon from '../../assets/icons/caret-down.svg'
import { Badge } from '../../components/Badge'
import { Button } from '../../components/Button'
import { location } from './data'

type LocationHeaderProps = {
  canComplete: boolean
}

export function LocationHeader({ canComplete }: LocationHeaderProps) {
  return (
    <header className="flex min-h-[50px] shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-gray-200 bg-white px-6 py-2">
      <a href="#" className="flex max-w-full shrink-0 items-center gap-2">
        <img src={caretDownIcon} alt="Back" width={12} height={12} className="rotate-90" />
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex min-w-0 items-center gap-2 leading-5 whitespace-nowrap">
            <span className="truncate text-base font-semibold text-black">{location.name}</span>
            <span className="shrink-0 text-[8px] text-gray-600">|</span>
            <span className="shrink-0 text-base font-semibold text-gray-600">{location.period}</span>
          </div>
          <Badge tone="neutral">{location.status}</Badge>
        </div>
      </a>
      <div className="ml-auto flex items-center justify-end gap-2">
        <Button variant="secondary">Save Draft</Button>
        <Button disabled={!canComplete}>Complete Compliance</Button>
      </div>
    </header>
  )
}
