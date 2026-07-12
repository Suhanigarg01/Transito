/**
 * Page header used at the top of every screen.
 *
 * The title uses the display grotesk (via global h1 styling); the description
 * is set in a serif italic to give each page an editorial, un-templated feel.
 *
 * Props:
 *  - eyebrow     : small uppercase kicker above the title (optional)
 *  - title       : main heading
 *  - description : one-line subtitle (rendered as serif italic)
 *  - children    : right-aligned actions (buttons, export, etc.)
 */
const PageHeader = ({ eyebrow, title, description, children }) => {
  return (
    <div className="flex flex-col gap-4 border-b border-stone-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        {eyebrow && (
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[26px] font-semibold text-stone-900">{title}</h1>
        {description && (
          <p className="font-serif text-[15px] italic text-stone-500">{description}</p>
        )}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  )
}

export default PageHeader
