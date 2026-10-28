import arrowRightIcon from '../../assets/icons/arrow-right.svg'
import sidebarToggleIcon from '../../assets/icons/sidebar-toggle.svg'
import { Button } from '../../components/Button'
import { PhotoUpload } from './PhotoUpload'
import type { Program, ProgramAnswers } from './programData'
import { StatusSelect } from './StatusSelect'

type ProgramDetailProps = {
  program: Program
  vendorName?: string
  position: number
  total: number
  answers: ProgramAnswers
  onChange: (answers: ProgramAnswers) => void
  onSaveAndNext: () => void
  listOpen: boolean
  onOpenList: () => void
}

export function ProgramDetail({
  program,
  vendorName,
  position,
  total,
  answers,
  onChange,
  onSaveAndNext,
  listOpen,
  onOpenList,
}: ProgramDetailProps) {
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col bg-white">
      {/* Only the content scrolls; the action footer stays pinned to the bottom */}
      <div className="flex min-h-0 w-full flex-1 flex-col gap-6 overflow-y-auto px-8 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Show programs"
            aria-controls="program-list"
            aria-expanded={listOpen}
            onClick={onOpenList}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 lg:hidden"
          >
            <img src={sidebarToggleIcon} alt="" width={28} height={28} />
          </button>
          <div className="flex min-w-0 flex-1 flex-col gap-1 text-gray-800">
            <p className="truncate text-sm">
              {vendorName && <span className="font-semibold">{vendorName} · </span>}
              Program {pad(position)} of {pad(total)}
            </p>
            <h1 className="truncate text-2xl font-semibold">{program.name}</h1>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-gray-800">Upload Photo</h2>
            <p className="text-sm text-gray-500">Add at least one photo showing the program in store.</p>
          </div>
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
        {/* A program needs both a status and at least one photo as evidence */}
        <Button onClick={onSaveAndNext} disabled={!answers.status || answers.photos.length === 0}>
          Save and Next
          <img src={arrowRightIcon} alt="" width={14} height={14} />
        </Button>
      </footer>
    </section>
  )
}
