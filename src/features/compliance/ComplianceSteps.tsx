import { Fragment } from 'react'
import caretLeftIcon from '../../assets/icons/caret-left.svg'
import caretRightDarkIcon from '../../assets/icons/caret-right-dark.svg'
import caretRightIcon from '../../assets/icons/caret-right.svg'
import { Badge } from '../../components/Badge'
import { steps } from './data'

type ComplianceStepsProps = {
  activeStep: number
  completedSteps: number
  onStepChange: (step: number) => void
}

export function ComplianceSteps({ activeStep, completedSteps, onStepChange }: ComplianceStepsProps) {
  const navButton =
    'flex size-7 cursor-pointer items-center justify-center rounded-lg border bg-white disabled:cursor-not-allowed'

  return (
    <nav className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 px-6">
      <ol className="flex items-center gap-3">
        {steps.map((step, index) => {
          const isActive = index === activeStep
          return (
            <Fragment key={step}>
              {index > 0 && (
                <li aria-hidden>
                  <img src={caretRightIcon} alt="" width={12} height={12} />
                </li>
              )}
              <li className="relative flex h-12 items-center">
                <button
                  type="button"
                  onClick={() => onStepChange(index)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`flex h-7 cursor-pointer items-center rounded-lg px-2.5 py-1 text-sm whitespace-nowrap ${
                    isActive ? 'font-semibold text-primary-600' : 'font-medium tracking-[-0.02em] text-gray-700'
                  }`}
                >
                  {step}
                </button>
                {isActive && (
                  <span className="absolute inset-x-[15.79%] bottom-0 h-0.5 rounded-t-[2px] bg-primary-500" />
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
      <div className="flex items-center justify-end gap-1.5">
        <Badge className="h-7 px-2">
          Step {completedSteps}/{steps.length} completed
        </Badge>
        <button
          type="button"
          aria-label="Previous step"
          disabled={activeStep === 0}
          onClick={() => onStepChange(activeStep - 1)}
          className={`${navButton} border-gray-200`}
        >
          <img src={caretLeftIcon} alt="" width={14} height={14} />
        </button>
        <button
          type="button"
          aria-label="Next step"
          disabled={activeStep === steps.length - 1}
          onClick={() => onStepChange(activeStep + 1)}
          className={`${navButton} border-gray-300 shadow-xs`}
        >
          <img src={caretRightDarkIcon} alt="" width={14} height={14} />
        </button>
      </div>
    </nav>
  )
}
