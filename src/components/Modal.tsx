import type { ReactNode } from 'react'
import { Button } from './Button'

type ModalProps = {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 py-6">
      <section
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
        className="w-full max-w-xl rounded-lg bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-950">
            {title}
          </h2>
          <Button variant="ghost" type="button" onClick={onClose} aria-label="Close modal">
            X
          </Button>
        </header>
        <div className="p-5">{children}</div>
      </section>
    </div>
  )
}
