import { useEffect, useState, type RefObject } from 'react'

/** True while the element is (roughly) on screen — used to pause WebGL when hidden. */
export function useInView(ref: RefObject<Element | null>, rootMargin = '100px') {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}
