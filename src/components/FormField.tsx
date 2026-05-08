import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

type BaseProps = {
  label: string
  error?: string
  children?: ReactNode
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>
type SelectProps = BaseProps & SelectHTMLAttributes<HTMLSelectElement>

export function FormField({ label, error, ...props }: InputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-950 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
        {...props}
      />
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  )
}

export function SelectField({ label, error, children, ...props }: SelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-950 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1 block text-sm text-red-600">{error}</span> : null}
    </label>
  )
}
