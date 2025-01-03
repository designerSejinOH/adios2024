import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Outlines, Environment, useTexture, Sky, Clouds, Cloud, ContactShadows } from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider, RapierRigidBody, useRapier } from '@react-three/rapier'
import { Balloon } from './Balloon'

interface SceneProps {
  color?: string
  text?: string
  textSize?: number
  textColor?: string
  isSheetOpen?: boolean
  isDepature?: boolean
  setIsBalloonGone?: (isBalloonGone: boolean) => void
  onHandleObject?: () => void
}

export const Scene = ({
  color,
  text,
  textSize,
  textColor,
  setIsBalloonGone,
  isDepature,
  onHandleObject,
}: SceneProps) => {
  const rigidBody = useRef<RapierRigidBody>(null)
  const cloudRef = useRef(null)
  // rotating clouds
  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.001
    }
  })

  // 새로운 useFrame을 추가하여 풍선의 위치 로깅
  useFrame(() => {
    if (rigidBody.current) {
      const position = rigidBody.current.translation()

      if (position.y > 5) {
        setIsBalloonGone(true)
      } else {
        setIsBalloonGone(false)
      }
    }
  })

  useEffect(() => {
    if (!isDepature) return // 부력을 적용하지 않음

    // isDepature가 true가 되면 즉시 위쪽으로 impulse를 줘서 초기 움직임 시작
    if (rigidBody.current) {
      rigidBody.current.applyImpulse({ x: 0, y: 0.3, z: 0 }, true)
    }

    const buoyancyForce = 8 * 0.2 * 0.1
    const interval = setInterval(() => {
      console.log('floating')
      if (rigidBody.current) {
        // 부력 적용
        rigidBody.current.addForce({ x: 0, y: buoyancyForce, z: 0 }, true)
        // 랜덤 바람 효과
        rigidBody.current.addForce(
          {
            x: (Math.random() - 0.5) * 0.01,
            y: 0,
            z: (Math.random() - 0.5) * 0.01,
          },
          true,
        )
      }
    }, 16)

    return () => clearInterval(interval)
  }, [isDepature]) // isFloating이 변경될 때마다 효과 재실행

  return (
    <>
      {/* 조명 */}
      <ambientLight intensity={1} />
      {/* <hemisphereLight intensity={0.45 * Math.PI} /> */}
      {/* <spotLight decay={0} angle={0.4} penumbra={1} position={[0, 1, 0]} castShadow shadow-bias={-0.00001} /> */}
      <directionalLight color='orange' position={[-10, -10, 0]} intensity={1.5} />
      <Clouds ref={cloudRef} material={THREE.MeshBasicMaterial}>
        <Cloud seed={10} bounds={50} volume={40} position={[2, 0, -2]} />
        <Cloud seed={10} bounds={50} volume={40} position={[-2, 10, -2]} />
      </Clouds>
      <Environment preset='city' />
      <Sky sunPosition={[0, 10, 0]} />
      <Physics gravity={[0, -9.8, 0]}>
        {/* 풍선 */}
        <RigidBody
          ref={rigidBody}
          colliders='hull'
          position={[0, -1, 0]}
          mass={1}
          linearDamping={0.5}
          angularDamping={0.5}
        >
          <Balloon
            text={text}
            color={color}
            textSize={textSize}
            textColor={textColor}
            onClick={() => {
              onHandleObject()
            }}
          />
        </RigidBody>
        {/* Floor */}
        <CuboidCollider position={[0, -1, 0]} args={[1, 0, 1]} />
      </Physics>
    </>
  )
}
