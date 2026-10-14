import arrowRightIcon from '../../assets/icons/arrow-right.svg'
import sidebarToggleIcon from '../../assets/icons/sidebar-toggle.svg'
import { Button } from '../../components/Button'
import { formatPrice, type SurveyAnswer, type SurveyItem } from './surveyData'

type SurveyDetailProps = {
  item: SurveyItem
  categoryName: string
  position: number
  total: number
  collected: number
  answer: SurveyAnswer
  onChange: (answer: SurveyAnswer) => void
  onSaveAndNext: () => void
  listOpen: boolean
  onOpenList: () => void
}

// Digits with an optional decimal part of up to 2 places, so only valid prices can be typed
const pricePattern = /^\d*(\.\d{0,2})?$/

export function SurveyDetail({
  item,
  categoryName,
  position,
  total,
  collected,
  answer,
  onChange,
  onSaveAndNext,
  listOpen,
  onOpenList,
}: SurveyDetailProps) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const hasPrice = formatPrice(answer.price) !== ''

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col justify-between overflow-y-auto bg-white pt-8">
      <div className="flex w-full flex-col gap-6 px-8 pb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Show survey items"
            aria-controls="survey-list"
            aria-expanded={listOpen}
            onClick={onOpenList}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 lg:hidden"
          >
            <img src={sidebarToggleIcon} alt="" width={28} height={28} />
          </button>
          <div className="flex min-w-0 flex-1 flex-col gap-1 text-gray-800">
            <p className="truncate text-sm">
              <span className="font-semibold">{categoryName} · </span>
              Item {pad(position)} of {pad(total)}
            </p>
            <h1 className="truncate text-2xl font-semibold">{item.name}</h1>
          </div>
        </div>

        <div className="flex flex-col gap-[11px]">
          <label htmlFor="survey-price" className="text-base font-semibold text-gray-800">
            What is the store price?
          </label>
          <div className="flex h-10 w-[200px] items-center rounded-lg border border-gray-200 bg-white focus-within:border-primary-500">
            <span className="pl-3 text-base text-gray-500">$</span>
            <input
              id="survey-price"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={answer.price}
              onChange={(event) => {
                const value = event.target.value.trim()
                if (pricePattern.test(value)) onChange({ ...answer, price: value })
              }}
              onBlur={() => {
                const formatted = formatPrice(answer.price)
                if (formatted !== answer.price) onChange({ ...answer, price: formatted })
              }}
              className="h-full min-w-0 flex-1 bg-transparent px-1.5 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[11px]">
          <label htmlFor="survey-description" className="text-base font-semibold text-gray-800">
            Description <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <textarea
            id="survey-description"
            rows={4}
            placeholder="Add any details about this price, e.g. where it was found or why it differs"
            value={answer.description}
            onChange={(event) => onChange({ ...answer, description: event.target.value })}
            className="w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2 text-base text-gray-800 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none"
          />
        </div>
      </div>

      <footer className="flex w-full shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-8 py-4">
        <p className="text-xs font-medium text-gray-700" aria-live="polite">
          {collected} of {total} prices collected
        </p>
        <Button onClick={onSaveAndNext} disabled={!hasPrice}>
          Save and Next
          <img src={arrowRightIcon} alt="" width={14} height={14} />
        </Button>
      </footer>
    </section>
  )
}
