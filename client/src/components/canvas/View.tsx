'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'
import * as THREE from 'three'

interface CommonProps {
  color?: THREE.ColorRepresentation
}

export const Common = ({ color }: CommonProps) => (
  <Suspense fallback={null}>
    {color && <color attach='background' args={[color]} />}
    <ambientLight />
    <PerspectiveCamera makeDefault fov={70} position={[0, 0, 10]} />
  </Suspense>
)

interface ViewProps {
  children: React.ReactNode
  orbit?: boolean
  perf?: boolean
  zoomable?: boolean
  multiCam?: boolean
  className?: string // className 속성 추가
}

const View = forwardRef(({ children, orbit, zoomable = false, multiCam, ...props }: ViewProps, ref) => {
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>
          {children}
          {orbit && (
            <OrbitControls
              enableDamping
              dampingFactor={0.1}
              rotateSpeed={0.5}
              enableZoom={zoomable}
              enablePan={zoomable}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
              minDistance={1}
              maxDistance={150}
            />
          )}
          {multiCam && <PerspectiveCamera makeDefault fov={15} position={[0, 0, 30]} />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
