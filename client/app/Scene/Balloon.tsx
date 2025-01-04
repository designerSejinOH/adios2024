import * as THREE from 'three'
import React, { useRef, useState, useEffect, use, useCallback } from 'react'
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
  position?: [number, number, number]
  color: string
  text?: string
  textSize?: number
  fontWeight?: string
  textColor?: string
  fontStyle?: string
  onClick: () => void
}

// Font paths defined outside component to prevent recreation
const FONTS = {
  serif: {
    light: './fonts/NotoSerifKR-Light.ttf',
    medium: './fonts/NotoSerifKR-Medium.ttf',
    bold: './fonts/NotoSerifKR-Bold.ttf',
  },
  'sans-serif': {
    light: './fonts/NotoSansKR-Light.ttf',
    medium: './fonts/NotoSansKR-Medium.ttf',
    bold: './fonts/NotoSansKR-Bold.ttf',
  },
} as const

// Font cache to store loaded fonts
const fontCache = new Map<string, FontFace>()

export const Balloon = ({
  position,
  color,
  text,
  textSize,
  fontStyle,
  fontWeight,
  textColor,
  onClick,
}: BalloonProps) => {
  const { nodes, materials } = useGLTF('/assets/balloon.glb') as GLTFResult
  const [isHovered, setIsHovered] = useState(false)
  const [currentFont, setCurrentFont] = useState<string | null>(null)
  const [forceUpdate, setForceUpdate] = useState(0)

  const ref = useRef<THREE.Mesh>(null!)
  const textRef = useRef<THREE.Mesh>(null!)

  const { viewport } = useThree()

  // Font loading function
  const loadFont = useCallback(async (fontPath: string) => {
    const cachedFont = fontCache.get(fontPath)
    if (cachedFont) {
      return cachedFont
    }

    try {
      const font = new FontFace('customFont', `url(${fontPath})`)
      const loadedFont = await font.load()
      document.fonts.add(loadedFont)
      fontCache.set(fontPath, loadedFont)
      return loadedFont
    } catch (error) {
      console.error('Error loading font:', error)
      return null
    }
  }, [])

  // Handle font changes
  useEffect(() => {
    const fontPath = FONTS[fontStyle][fontWeight]

    loadFont(fontPath).then((loadedFont) => {
      if (loadedFont) {
        setCurrentFont(fontPath)
        // Force Text component to re-render
        setForceUpdate((prev) => prev + 1)
      }
    })
  }, [fontStyle, fontWeight, loadFont])

  useEffect(() => {
    //when the balloon is hovered, cursor changes to pointer and mateial emissive color changes
    if (isHovered) {
      document.body.style.cursor = 'pointer'
    } else {
      document.body.style.cursor = 'auto'
    }
  }, [isHovered])

  // Force RenderTexture update on font change
  useFrame(() => {
    if (textRef.current) {
      if (Array.isArray(textRef.current.material)) {
        textRef.current.material.forEach((material) => (material.needsUpdate = true))
      } else {
        textRef.current.material.needsUpdate = true
      }
    }
  })

  return (
    <mesh
      position={position}
      ref={ref}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => {
        setIsHovered(false)
      }}
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
      {ref.current && currentFont && (
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
            <RenderTexture attach='map' key={`${currentFont}-${forceUpdate}`}>
              <PerspectiveCamera makeDefault manual aspect={2 / 1} position={[0, 0, 5]} />
              <Text
                font={currentFont}
                fontSize={textSize}
                maxWidth={3}
                lineHeight={1.2}
                overflowWrap='break-word'
                textAlign='center'
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
