import { useEffect } from 'react'

/**
 * Lightweight modal dialog used by the CRUD pages to host forms.
 *
 * Props:
 *  - open : boolean
 *  - title : header text
 *  - description : optional sub-line under the title (serif italic)
 *  - onClose() : called on backdrop click, Esc, or the ✕ button
 *  - children : modal body
 */
const Modal = ({ open, title, description, onClose, children }) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="animate-fade fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-pop w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-stone-900/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
            {description && (
              <p className="mt-0.5 font-serif text-sm italic text-stone-500">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.7" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
