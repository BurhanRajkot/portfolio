import { lazy, Suspense, useState } from 'react'

// Code-split: the Spline runtime is only downloaded when a scene URL is configured.
const Spline = lazy(() => import('@splinetool/react-spline'))

export default function SplineScene({ scene, className }: { scene: string; className?: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`spline-scene ${loaded ? 'is-loaded' : ''} ${className ?? ''}`}>
      <Suspense fallback={null}>
        <Spline scene={scene} onLoad={() => setLoaded(true)} />
      </Suspense>
    </div>
  )
}
