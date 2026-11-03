import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { morphFragment, morphVertex } from './shaders'
import { SHAPES } from './shapes'
import { CHAPTERS, sceneState } from '../lib/chapters'

// particle palettes follow the OS theme: ink dots on paper, bone dots on ink
const THEMES = {
  light: { a: new THREE.Color('#24221f'), b: new THREE.Color('#8d887f'), accent: new THREE.Color('#c2410c') },
  dark: { a: new THREE.Color('#ece6da'), b: new THREE.Color('#8f897e'), accent: new THREE.Color('#f07a45') },
}
const darkQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null
const theme = () => (darkQuery?.matches ? THEMES.dark : THEMES.light)

function Particles({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null)
  const { gl, viewport, camera, size } = useThree()
  const shape = useRef(0)
  const intro = useRef(0)
  const mouseWorld = useMemo(() => new THREE.Vector3(), [])
  const mouseLocal = useMemo(() => new THREE.Vector3(), [])
  const ray = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const lastMove = useRef(0)

  const material = useRef<THREE.ShaderMaterial>(null)
  const [geometry, initialUniforms] = useMemo(() => {
    const g = new THREE.BufferGeometry()
    SHAPES.forEach((gen, i) => g.setAttribute(`p${i}`, new THREE.BufferAttribute(gen(count), 3)))
    // `position` is required by three; the shader reads p0…p6 instead
    g.setAttribute('position', g.getAttribute('p0'))
    const r = new Float32Array(count)
    for (let i = 0; i < count; i++) r[i] = Math.random()
    g.setAttribute('aRand', new THREE.BufferAttribute(r, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20)
    const u = {
      uShape: { value: 0 },
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uSize: { value: 2.0 },
      uMouse: { value: new THREE.Vector3(99, 99, 99) },
      uMouseStrength: { value: 0 },
      uColorA: { value: theme().a.clone() },
      uColorB: { value: theme().b.clone() },
      uAccent: { value: theme().accent.clone() },
      uOpacity: { value: 1 },
    }
    return [g, u]
  }, [count, gl])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const g = group.current
    // always drive the uniforms of the material that is actually on screen
    // (dev StrictMode can leave the memoised object out of sync with it)
    const uniforms = material.current?.uniforms as typeof initialUniforms | undefined
    if (!g || !uniforms) return
    const wide = size.width >= 900

    // intro fly-in, then follow the scroll position
    intro.current = Math.min(intro.current + dt * 0.6, 1)
    uniforms.uIntro.value = intro.current
    shape.current = THREE.MathUtils.damp(shape.current, sceneState.progress, 3.2, dt)
    uniforms.uShape.value = shape.current
    uniforms.uTime.value += dt

    // colours track the OS light/dark setting
    const t = theme()
    uniforms.uColorA.value.lerp(t.a, 0.1)
    uniforms.uColorB.value.lerp(t.b, 0.1)
    uniforms.uAccent.value.lerp(t.accent, 0.1)

    // place the shape. Desktop: beside the text. Phones: in the stage above the hero text,
    // then centred and dimmed behind the content for the rest of the page.
    const i0 = Math.floor(shape.current)
    const f = shape.current - i0
    const ch = (i: number) => CHAPTERS[Math.min(i, CHAPTERS.length - 1)]
    const lerpCh = (fn: (c: (typeof CHAPTERS)[number], i: number) => number) => THREE.MathUtils.lerp(fn(ch(i0), i0), fn(ch(i0 + 1), i0 + 1), f)
    const pxToWorld = viewport.height / size.height
    const stage = sceneState.stage
    const stageY = stage.radius ? (size.height / 2 - stage.center) * pxToWorld : viewport.height * 0.22

    const x = wide ? lerpCh((c) => c.x * viewport.width) : 0
    const y = wide ? 0 : lerpCh((_, i) => (i === 0 ? stageY : 0))
    g.position.x = THREE.MathUtils.damp(g.position.x, x + state.pointer.x * 0.2, 3, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, y + state.pointer.y * (wide ? 0.15 : 0.05), 3, dt)

    // shapes are ~1.7 units in radius; on phones the intro shape is sized to fit its stage
    const stageScale = stage.radius ? (stage.radius * pxToWorld) / 1.75 : 0.6
    const mobileBase = Math.min(viewport.width / 4.2, 0.75)
    const scale = wide
      ? Math.min(viewport.height / 6.6, 0.95)
      : lerpCh((_, i) => (i === 0 ? Math.min(mobileBase, stageScale) : mobileBase))
    g.scale.setScalar(scale)
    uniforms.uOpacity.value = THREE.MathUtils.damp(uniforms.uOpacity.value, lerpCh((c) => (wide ? c.o : c.mo)), 3, dt)

    // gentle sway + a slow turn so the 3D forms read as 3D
    g.rotation.y = Math.sin(uniforms.uTime.value * 0.25) * 0.45 + state.pointer.x * 0.35
    g.rotation.x = -state.pointer.y * 0.2

    // cursor → local particle space, for the repulsion effect
    ray.setFromCamera(state.pointer, camera)
    if (ray.ray.intersectPlane(plane, mouseWorld)) {
      mouseLocal.copy(mouseWorld)
      g.worldToLocal(mouseLocal)
      uniforms.uMouse.value.copy(mouseLocal)
    }
    const moved = state.pointer.x !== lastMove.current
    lastMove.current = state.pointer.x
    uniforms.uMouseStrength.value = THREE.MathUtils.damp(uniforms.uMouseStrength.value, moved ? 1 : 0.6, 2, dt)
  })

  return (
    <group ref={group}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          vertexShader={morphVertex}
          fragmentShader={morphFragment}
          uniforms={initialUniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  )
}

export default function ParticleScene() {
  const count = typeof window !== 'undefined' && window.innerWidth < 760 ? 5000 : 12000
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 40 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        eventSource={document.getElementById('root') ?? undefined}
        eventPrefix="client"
      >
        <Particles count={count} />
      </Canvas>
    </div>
  )
}
