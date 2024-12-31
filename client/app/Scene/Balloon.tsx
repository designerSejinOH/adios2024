import * as THREE from 'three'
import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Line001: THREE.Mesh
  }
  materials: {}
}

interface BalloonProps {
  color: string
  onClick: () => void
}

export const Balloon = ({ color, onClick }: BalloonProps) => {
  const { nodes, materials } = useGLTF('/assets/balloon.glb') as GLTFResult
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<THREE.Mesh>(null!)

  useEffect(() => {
    //when the balloon is hovered, cursor changes to pointer and mateial emissive color changes
    if (isHovered) {
      document.body.style.cursor = 'pointer'
    } else {
      document.body.style.cursor = 'auto'
    }
  }, [isHovered])

  return (
    <mesh
      ref={ref}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={onClick}
      scale={2}
      castShadow
      receiveShadow
      geometry={nodes.Line001.geometry}
    >
      <meshStandardMaterial
        color={color}
        metalness={0.1}
        roughness={0.3}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        emissive={isHovered ? '#7e7e7e' : '#000000'}
        emissiveIntensity={0.5}
        attach='material'
      />
    </mesh>
  )
}

useGLTF.preload('/assets/balloon.glb')
