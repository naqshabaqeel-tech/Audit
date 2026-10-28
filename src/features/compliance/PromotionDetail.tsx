import arrowRightIcon from '../../assets/icons/arrow-right.svg'
import sidebarToggleIcon from '../../assets/icons/sidebar-toggle.svg'
import { Badge } from '../../components/Badge'
import { Button } from '../../components/Button'
import { pricingTiers, type Promotion } from './data'
import { PhotoUpload } from './PhotoUpload'
import { StatusSelect, type MarkStatus } from './StatusSelect'

export type PromotionAnswers = {
  signageInUse?: boolean
  pricingTier?: number
  photos: string[]
  status?: MarkStatus
}

type PromotionDetailProps = {
  promotion: Promotion
  vendorName?: string
  position: number
  total: number
  answers: PromotionAnswers
  onChange: (answers: PromotionAnswers) => void
  onSaveAndNext: () => void
  listOpen: boolean
  onOpenList: () => void
  /** Only provided for promotions added during the audit (not ordered) */
  onRemove?: () => void
}

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border px-8 py-1 text-base font-semibold text-gray-800 ${
        selected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  )
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex w-full flex-col gap-[11px]">
      <legend className="mb-[11px] truncate text-base font-semibold text-gray-800">{title}</legend>
      {children}
    </fieldset>
  )
}

/** Marks the tier the location ordered, so it's easy to compare with what's running */
function OrderedTag({ onSelected = false }: { onSelected?: boolean }) {
  return (
    <span
      className={`rounded-md px-1.5 py-0.5 text-xs font-medium text-primary-700 ${onSelected ? 'bg-white' : 'bg-primary-50'}`}
    >
      Ordered
    </span>
  )
}

export function PromotionDetail({
  promotion,
  vendorName,
  position,
  total,
  answers,
  onChange,
  onSaveAndNext,
  listOpen,
  onOpenList,
  onRemove,
}: PromotionDetailProps) {
  const pad = (n: number) => String(n).padStart(2, '0')

  const stats = [
    { label: 'Single unit price', value: promotion.unitPrice },
    { label: 'Ordered Tier', value: promotion.orderedTier },
    { label: 'Signage Req.', value: promotion.requiredSignage.join(', ') },
  ]

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col bg-white">
      {/* Only the content scrolls; the action footer stays pinned to the bottom */}
      <div className="flex min-h-0 w-full flex-1 flex-col gap-6 overflow-y-auto px-8 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Show promotions"
            aria-controls="promotion-list"
            aria-expanded={listOpen}
            onClick={onOpenList}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 lg:hidden"
          >
            <img src={sidebarToggleIcon} alt="" width={28} height={28} />
          </button>
          <div className="flex min-w-0 flex-1 flex-col gap-1 text-gray-800">
            <p className="truncate text-sm">
              {vendorName && <span className="font-semibold">{vendorName} · </span>}
              Promotion {pad(position)} of {pad(total)}
            </p>
            <div className="flex min-w-0 items-center gap-2">
              <h1 className="truncate text-2xl font-semibold">{promotion.name}</h1>
              {!promotion.ordered && <Badge tone="neutral">Not ordered</Badge>}
            </div>
          </div>
          {onRemove && (
            <Button variant="secondary" onClick={onRemove}>
              Remove
            </Button>
          )}
        </div>

        <dl className="flex w-full divide-x divide-gray-100 rounded-lg border border-gray-100 bg-gray-25">
          {stats.map((stat) => (
            <div key={stat.label} className="flex min-w-0 flex-1 flex-col gap-[7px] px-4 py-2 text-base">
              <dt className="text-gray-500">{stat.label}</dt>
              <dd className="font-semibold text-black">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <Question title="Which pricing tier is running?">
          <div className="flex w-full flex-wrap gap-x-3 gap-y-2">
            {pricingTiers.map((tier, index) => (
              <OptionButton
                key={index}
                selected={answers.pricingTier === index}
                onClick={() => onChange({ ...answers, pricingTier: index })}
              >
                {tier}
                {tier === promotion.orderedTier && (
                  <span className="ml-2">
                    <OrderedTag onSelected={answers.pricingTier === index} />
                  </span>
                )}
              </OptionButton>
            ))}
          </div>
        </Question>

        <Question title="Is the required signage in use">
          <div className="flex gap-2.5">
            {[true, false].map((value) => (
              <OptionButton
                key={String(value)}
                selected={answers.signageInUse === value}
                onClick={() => onChange({ ...answers, signageInUse: value })}
              >
                {value ? 'Yes' : 'No'}
              </OptionButton>
            ))}
          </div>
        </Question>

        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-gray-800">Upload Photo</h3>
          <PhotoUpload photos={answers.photos} onChange={(photos) => onChange({ ...answers, photos })} />
        </div>
      </div>

      <footer className="flex w-full shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-8 py-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span id="mark-status-label" className="text-xs font-medium text-gray-700">
            Mark Status:
          </span>
          <StatusSelect
            aria-labelledby="mark-status-label"
            value={answers.status}
            onChange={(status) => onChange({ ...answers, status })}
          />
        </div>
        <Button onClick={onSaveAndNext} disabled={!answers.status}>
          Save and Next
          <img src={arrowRightIcon} alt="" width={14} height={14} />
        </Button>
      </footer>
    </section>
  )
}
