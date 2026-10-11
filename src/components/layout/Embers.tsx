const EMBERS = [
  { left: '12%', size: 4, delay: '0s', duration: '5.5s' },
  { left: '28%', size: 3, delay: '1.4s', duration: '6.5s' },
  { left: '46%', size: 5, delay: '0.6s', duration: '5s' },
  { left: '63%', size: 3, delay: '2.6s', duration: '6s' },
  { left: '78%', size: 4, delay: '1.9s', duration: '7s' },
  { left: '90%', size: 3, delay: '3.4s', duration: '5.8s' },
]

/** Decorative embers rising behind the logo. Purely visual; hidden from assistive tech. */
export function Embers() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden" aria-hidden>
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="ember-particle absolute bottom-0 rounded-full bg-ember-400"
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            animationDelay: e.delay,
            animationDuration: e.duration,
          }}
        />
      ))}
    </div>
  )
}
