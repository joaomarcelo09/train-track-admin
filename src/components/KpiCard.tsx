import type { ReactNode } from 'react'

type KpiCardProps = {
  label: string
  value: string
  detail?: string
  icon: ReactNode
}

export function KpiCard({ label, value, detail, icon }: KpiCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-md bg-amber-100 text-amber-700">
          {icon}
        </div>
      </div>
      {detail ? <p className="mt-4 text-sm text-slate-500">{detail}</p> : null}
    </article>
  )
}
