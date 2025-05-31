import { clsx } from 'clsx'

export function Screenshot({
  width,
  height,
  src,
  className,
}: {
  width: number
  height: number
  src: string
  className?: string
}) {
  return (
    <div
      style={{ '--width': width, '--height': height } as React.CSSProperties}
      className={clsx(
        className,
        'relative aspect-[var(--width)/var(--height)] [--radius:var(--radius-xl)]',
      )}
    >
      <div className="absolute -inset-(--padding) rounded-[calc(var(--radius)+var(--padding))] shadow-xs ring-1 ring-black/5 [--padding:--spacing(2)]" />
      <img
        alt=""
        src={src}
        className="h-full rounded-(--radius) shadow-2xl ring-1 ring-black/10"
      />
    </div>
  )
}
