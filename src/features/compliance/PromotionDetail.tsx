import { useRef } from 'react'
import arrowRightIcon from '../../assets/icons/arrow-right.svg'
import uploadIcon from '../../assets/icons/upload.svg'
import sidebarToggleIcon from '../../assets/icons/sidebar-toggle.svg'
import xIcon from '../../assets/icons/x.svg'
import { Badge } from '../../components/Badge'
import { Button } from '../../components/Button'
import type { DesignVariation } from '../../components/useDesignVariation'
import { pricingTiers, type Promotion } from './data'
import { StatusSelect, type MarkStatus } from './StatusSelect'

export type PromotionAnswers = {
  signageInUse?: boolean
  /** Variation B: which of the required signage items are in use */
  signagePresent?: string[]
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
  /** A: chip answers, status in the footer. B: radios/checkboxes on grey panels, status in the form. C: A's chips in a quieter layout, status in the form. */
  variation?: DesignVariation
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

/** Variations B and C: a question with its answer below. B puts it on a grey panel; C leaves it plain. */
function QuestionRow({
  id,
  title,
  plain = false,
  children,
}: {
  id: string
  title: string
  plain?: boolean
  children: React.ReactNode
}) {
  const titleId = `question-${id}`
  return (
    <div role="group" aria-labelledby={titleId} className={`flex flex-col gap-3 ${plain ? '' : 'rounded-lg bg-gray-50 p-4'}`}>
      <span id={titleId} className={`font-semibold text-gray-800 ${plain ? 'text-sm' : 'text-base'}`}>
        {title}
      </span>
      {children}
    </div>
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
  variation = 'A',
}: PromotionDetailProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const pad = (n: number) => String(n).padStart(2, '0')

  const stats = [
    { label: 'Single unit price', short: 'Unit price', value: promotion.unitPrice },
    { label: 'Ordered Tier', short: 'Ordered', value: promotion.orderedTier },
    { label: 'Signage Req.', short: 'Signage', value: promotion.requiredSignage.join(', ') },
  ]

  // C: quieter, focused layout (inline reference facts, no panels, more white space between questions)
  const focused = variation === 'C'

  const addPhotos = (files: FileList | null) => {
    if (!files?.length) return
    const urls = Array.from(files, (file) => URL.createObjectURL(file))
    onChange({ ...answers, photos: [...answers.photos, ...urls] })
  }

  const tierOptions = (
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
  )

  const signageOptions = (
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
  )

  const statusSelect = (labelledBy: string) => (
    <StatusSelect
      aria-labelledby={labelledBy}
      value={answers.status}
      onChange={(status) => onChange({ ...answers, status })}
    />
  )

  const signagePresent = answers.signagePresent ?? []

  const tierRadios = (
    <div className="flex flex-wrap gap-x-10 gap-y-4">
      {pricingTiers.map((tier, index) => (
        <label key={index} className="flex cursor-pointer items-center gap-2 text-base text-gray-800">
          <input
            type="radio"
            name={`pricing-tier-${promotion.id}`}
            checked={answers.pricingTier === index}
            onChange={() => onChange({ ...answers, pricingTier: index })}
            className="size-4 cursor-pointer accent-primary-500"
          />
          {tier}
          {tier === promotion.orderedTier && <OrderedTag />}
        </label>
      ))}
    </div>
  )

  const signageCheckboxes = (
    <div className="flex flex-wrap gap-x-10 gap-y-4">
      {promotion.requiredSignage.map((name) => (
        <label key={name} className="flex cursor-pointer items-center gap-2 text-base text-gray-800">
          <input
            type="checkbox"
            checked={signagePresent.includes(name)}
            onChange={(event) =>
              onChange({
                ...answers,
                signagePresent: event.target.checked
                  ? [...signagePresent, name]
                  : signagePresent.filter((item) => item !== name),
              })
            }
            className="size-4 cursor-pointer accent-primary-500"
          />
          {name}
        </label>
      ))}
    </div>
  )

  const photoField = (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        aria-label="Upload photo"
        onClick={() => fileInput.current?.click()}
        className={`flex size-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-200 hover:bg-gray-100 ${
          variation === 'B' ? 'bg-white' : 'bg-gray-50'
        }`}
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
        {answers.photos.map((photo, index) => (
          <li key={`${photo}-${index}`} className="relative size-20 rounded-lg bg-gray-50">
            <img src={photo} alt={`Photo ${index + 1}`} className="size-full rounded-lg border border-gray-200 object-cover" />
            <button
              type="button"
              aria-label={`Remove photo ${index + 1}`}
              onClick={() => onChange({ ...answers, photos: answers.photos.filter((_, i) => i !== index) })}
              className="absolute top-[-14px] left-[65px] flex size-7 cursor-pointer items-center justify-center rounded-full bg-primary-100"
            >
              <img src={xIcon} alt="" width={16} height={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col bg-white">
      {/* Only the content scrolls; the action footer stays pinned to the bottom */}
      <div className="min-h-0 w-full flex-1 overflow-y-auto px-8 pt-8 pb-6">
        <div className={`flex w-full flex-col ${focused ? 'gap-8' : 'gap-6'}`}>
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
              {/* C shows the reference facts as one quiet line instead of a card */}
              {focused && (
                <dl className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex gap-1.5">
                      <dt className="text-gray-500">{stat.short}</dt>
                      <dd className="font-medium text-gray-800">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            {onRemove && (
              <Button variant="secondary" onClick={onRemove}>
                Remove
              </Button>
            )}
          </div>

          {!focused && (
            <dl className="flex w-full divide-x divide-gray-100 rounded-lg border border-gray-100 bg-gray-25">
              {stats.map((stat) => (
                <div key={stat.label} className="flex min-w-0 flex-1 flex-col gap-[7px] px-4 py-2 text-base">
                  <dt className="text-gray-500">{stat.label}</dt>
                  <dd className="font-semibold text-black">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {variation === 'A' ? (
            <>
              <Question title="Which pricing tier is running?">{tierOptions}</Question>
              <Question title="Is the required signage in use">{signageOptions}</Question>
              <div className="flex flex-col gap-3">
                <h3 className="text-base font-semibold text-gray-800">Upload Photo</h3>
                {photoField}
              </div>
            </>
          ) : (
            <div className={`flex flex-col ${focused ? 'gap-8' : 'gap-3'}`}>
              {/* C uses A's large chips, which are easier to tap on small tablets; B uses radios and checkboxes */}
              <QuestionRow id="pricing-tier" title="Which pricing tier is running?" plain={focused}>
                {focused ? tierOptions : tierRadios}
              </QuestionRow>
              <QuestionRow
                id="signage"
                title={focused ? 'Is the required signage in use' : 'Which required signage is in use?'}
                plain={focused}
              >
                {focused ? signageOptions : signageCheckboxes}
              </QuestionRow>
              <QuestionRow id="photos" title="Upload Photo" plain={focused}>
                {photoField}
              </QuestionRow>
              <QuestionRow id="status" title="Mark status" plain={focused}>
                <div className="flex">{statusSelect('question-status')}</div>
              </QuestionRow>
            </div>
          )}
        </div>
      </div>

      <footer className="w-full shrink-0 border-t border-gray-100 px-8 py-4">
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          {variation === 'A' ? (
            <div className="flex flex-wrap items-center gap-2.5">
              <span id="mark-status-label" className="text-xs font-medium text-gray-700">
                Mark Status:
              </span>
              {statusSelect('mark-status-label')}
            </div>
          ) : (
            !answers.status && <p className="text-xs font-medium text-gray-500">Mark the status to continue</p>
          )}
          <Button onClick={onSaveAndNext} disabled={!answers.status} className="ml-auto">
            Save and Next
            <img src={arrowRightIcon} alt="" width={14} height={14} />
          </Button>
        </div>
      </footer>
    </section>
  )
}
