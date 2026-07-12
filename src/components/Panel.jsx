/**
 * A titled surface — the standard container for charts, lists and grouped
 * content. Header (eyebrow + title + optional action) sits above a divider,
 * with the body below.
 *
 * Props:
 *  - eyebrow / title : header text
 *  - action  : right-aligned node in the header
 *  - bodyClassName : padding/layout override for the body (default p-5)
 *  - noBodyPadding : drop body padding entirely (e.g. for edge-to-edge lists)
 */
const Panel = ({
  eyebrow,
  title,
  action,
  children,
  className = '',
  bodyClassName,
  noBodyPadding = false,
}) => {
  const hasHeader = eyebrow || title || action
  return (
    <section className={`card overflow-hidden ${className}`}>
      {hasHeader && (
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-4">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && (
              <h3 className="mt-0.5 text-[15px] font-semibold text-stone-800">{title}</h3>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName ?? (noBodyPadding ? '' : 'p-5')}>{children}</div>
    </section>
  )
}

export default Panel
