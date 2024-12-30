'use client'

import { BottomSheet, Loading, SheetHeader } from '@/components/dom'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
import { Suspense, useRef, useState } from 'react'
import { Box, Sky, Sphere } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { TypeAnimation } from 'react-type-animation'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='w-full h-96 flex items-center justify-center'>
      <Loading />
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <div className='w-screen h-screen flex flex-col md:flex-row items-center'>
      <Header />
      <div className='w-full h-full flex justify-center items-center bg-gray-200'>
        <View orbit className='flex h-full w-full flex-col items-center justify-center'>
          <Suspense fallback={null}>
            <Sky />
            <Mesh
              onClick={() => {
                setIsSheetOpen(true)
              }}
            />
            <Common color={undefined} />
          </Suspense>
        </View>
      </div>
      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false)
        }}
      >
        <SheetHeader />
        <p>Bottom Sheet Content</p>
      </BottomSheet>
    </div>
  )
}

const Header = () => {
  return (
    <div className='fixed z-10 top-0 left-0 flex w-full h-fit flex-row justify-between items-center px-6 py-4'>
      <TypeAnimation
        cursor={false}
        sequence={['Goobye 2024', 1000, '굿바이 2024']}
        wrapper='div'
        speed={30}
        className='text-3xl font-pretendard text-black'
      />
    </div>
  )
}

interface MeshProps {
  onHover?: () => void
  onClick?: () => void
}

const Mesh = ({ onHover, onClick }: MeshProps) => {
  const ref = useRef<null | THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01
      ref.current.rotation.y += 0.01
    }
  }),
    [ref]

  return (
    <mesh
      ref={ref}
      onClick={onClick}
      onPointerOver={() => {
        setIsHovered(true)
        onHover && onHover()
      }}
      onPointerOut={() => setIsHovered(false)}
    >
      <Sphere ref={ref} args={[1, 32, 32]} position={[0, 0, 0]} scale={isHovered ? [1.5, 1.5, 1.5] : [1, 1, 1]}>
        <meshStandardMaterial color='hotpink' />
      </Sphere>
    </mesh>
  )
}
