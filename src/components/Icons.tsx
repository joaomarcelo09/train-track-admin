type IconProps = {
  className?: string
}

export function RailIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3h10l2 15H5L7 3Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 8h8M6 18l-2 3M18 18l2 3M9 21l1-3M15 21l-1-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function TrainIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 8h8M8 13h.01M16 13h.01M9 20l2-3M15 20l-2-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function LineIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19C9 7 15 17 19 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="19" cy="5" r="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

export function GaugeIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 15a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m12 15 4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 20h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
