export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning'

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-gray-100 text-gray-950',
  info: 'border border-primary-100 bg-primary-50 text-primary-700',
  success: 'border border-success-100 bg-success-50 text-success-700',
  warning: 'border border-warning-100 bg-warning-50 text-warning-600',
}

type BadgeProps = {
  tone?: BadgeTone
  className?: string
  children: React.ReactNode
}

export function Badge({ tone = 'info', className = '', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg px-1.5 py-1 text-center text-xs font-medium whitespace-nowrap ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
