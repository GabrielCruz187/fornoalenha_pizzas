import { animate, useMotionValue, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface AnimatedNumberProps {
  value: number
  format: (n: number) => string
  duration?: number
  delay?: number
}

/** Counts up from the previous value to `value`; writes straight to the DOM to avoid re-renders per frame. */
export function AnimatedNumber({ value, format, duration = 0.9, delay = 0 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.textContent = format(value)
      return
    }
    const unsubscribe = motionValue.on('change', (n) => {
      el.textContent = format(n)
    })
    const controls = animate(motionValue, value, { duration, delay, ease: [0.16, 1, 0.3, 1] })
    return () => {
      unsubscribe()
      controls.stop()
    }
  }, [value, format, duration, delay, reduced, motionValue])

  return <span ref={ref}>{format(reduced ? value : 0)}</span>
}
