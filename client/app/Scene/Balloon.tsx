import * as THREE from 'three'
import React, { useRef, useState, useEffect, use } from 'react'
import { Decal, PerspectiveCamera, RenderTexture, useGLTF, Text, useTexture, Plane } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame, useThree } from '@react-three/fiber'

type GLTFResult = GLTF & {
  nodes: {
    Line001: THREE.Mesh
  }
  materials: {}
}

interface BalloonProps {
  color: string
  text?: string
  textSize?: number
  textColor?: string
  onClick: () => void
}

export const Balloon = ({ color, text, textSize, textColor, onClick }: BalloonProps) => {
  const { nodes, materials } = useGLTF('/assets/balloon.glb') as GLTFResult
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<THREE.Mesh>(null!)

  const { viewport } = useThree()

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
        opacity={0.7}
        side={THREE.DoubleSide}
        emissiveIntensity={0.5}
      />
      {ref.current && (
        <Decal
          mesh={ref}
          position={[0, 0.45, 0]} // Adjust position as needed
          rotation={[0, Math.PI / 3, 0]} // Rotate if necessary
          scale={[1, 1, 1]} // Reduce depth (scale.z)
        >
          <meshStandardMaterial
            metalness={0.1}
            roughness={0.3}
            transparent={true}
            polygonOffset={true}
            polygonOffsetFactor={-10} // Prevent Z-fighting
            // side={THREE.DoubleSide} // Ensure visibility from both sides
            alphaTest={0.5} // Optional: Use for binary transparency
          >
            <RenderTexture attach='map'>
              <PerspectiveCamera makeDefault manual aspect={2 / 1} position={[0, 0, 5]} />
              <Text
                fontSize={textSize}
                maxWidth={(viewport.width / 100) * 150}
                overflowWrap='break-word'
                anchorX='center'
                anchorY='middle'
                color={textColor}
              >
                {text}
              </Text>
            </RenderTexture>
          </meshStandardMaterial>
        </Decal>
      )}
    </mesh>
  )
}

useGLTF.preload('/assets/balloon.glb')
