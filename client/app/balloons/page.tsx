'use client'

import { Header, Icon, Loading } from '@/components/dom'
import * as THREE from 'three'
import { Suspense, use, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Outlines, Environment, useTexture, Sky, Clouds, Cloud } from '@react-three/drei'
import { getMessages } from '@/lib/api'
import { useFrame, useThree } from '@react-three/fiber'
import { Balloon } from '../Scene/Balloon'
import { AnimatePresence, motion } from 'framer-motion'
import { View } from '@/components/canvas/View'

export default function Page() {
  const router = useRouter()
  const [datas, setDatas] = useState([])

  const [selectedBalloon, setSelectedBalloon] = useState<string | null>(null)

  const getMessagesData = async () => {
    const messages = await getMessages()
    setDatas(messages)
  }

  useEffect(() => {
    getMessagesData()
  }, [])

  //message의 created_at 날짜 2024.05.25 처럼 변환
  const transformDate = (date: string) => {
    const year = date.slice(0, 4)
    const month = date.slice(5, 7)
    const day = date.slice(8, 10)
    return `${year}.${month}.${day}`
  }

  return (
    <div className='w-screen max-h-dvh h-screen flex flex-col items-center'>
      <Header />
      <div className='w-full h-full flex justify-center items-center bg-gray-200'>
        <View multiCam zoomable orbit className='flex h-full w-full flex-col items-center justify-center'>
          <Suspense fallback={null}>
            <ambientLight intensity={1} />
            <directionalLight color='orange' position={[-10, -10, 0]} intensity={1.5} />
            <CloudGroup />
            <BalloonScene
              datas={datas}
              setSelectedBalloon={(id) => {
                setSelectedBalloon(id)
              }}
            />
            <Environment preset='city' />
            <Sky sunPosition={[0, 10, 0]} />
          </Suspense>
        </View>
      </div>
      <AnimatePresence>
        {selectedBalloon && (
          <motion.div className='fixed mb-4 pl-3 pr-4 py-3 flex flex-col justify-center items-end gap-2 mr-4 z-30 bottom-0 right-0 w-fit h-fit bg-white/70 backdrop-blur-sm rounded-2xl'>
            <div className='w-fit h-fit flex flex-row justify-center items-start gap-1 '>
              <div
                style={{
                  color: datas.find((data) => data.id === selectedBalloon)?.color,
                }}
                className='w-fit h-fit py-1'
              >
                <Icon icon='balloon' size={20} />
              </div>
              <p className='text-md'>{datas.find((data) => data.id === selectedBalloon)?.message}</p>
            </div>
            <div className='w-fit h-fit text-xs text-black/50'>
              {transformDate(datas.find((data) => data.id === selectedBalloon)?.created_at)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => {
          router.push('/')
        }}
        className='fixed z-20 w-fit h-fit bottom-0 bg-white/30 backdrop-blur-sm text-white pl-2 pr-3 py-2 rounded-xl left-0 mb-4 ml-4 flex flex-row gap-1 justify-center items-center  font-[pretendard] md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out '
      >
        <Icon icon='balloon' size={16} />
        메세지 보내러 가기
      </button>
    </div>
  )
}

const CloudGroup = () => {
  const cloudRef = useRef(null)
  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.001
    }
  })

  return (
    <>
      <Clouds ref={cloudRef} material={THREE.MeshBasicMaterial}>
        <Cloud seed={10} bounds={50} volume={40} position={[2, 0, -2]} />
        <Cloud seed={10} bounds={50} volume={40} position={[-2, 10, -2]} />
      </Clouds>
    </>
  )
}
// BalloonScene 컴포넌트 - Canvas 내부에서 실행될 컴포넌트
const BalloonScene = ({
  datas,
  setSelectedBalloon,
}: {
  datas: {
    id: string
    color: string
    message: string
    text_size: number
    font_weight: string
    text_color: string
    font_style: string
  }[]
  setSelectedBalloon: (id: string) => void
}) => {
  const [balloonPositions, setBalloonPositions] = useState<[number, number, number][]>([])
  const targetPositions = useRef<[number, number, number][]>([])
  const currentPositions = useRef<{ x: number; y: number; z: number }[]>([])
  const animationStarted = useRef(false)

  const MIN_DISTANCE = 1.5
  const SCOPE = 2
  const INITIAL_Y = -10

  const generateNonOverlappingPositions = (count: number, scope: number, minDistance: number) => {
    const positions: [number, number, number][] = []

    while (positions.length < count) {
      const position: [number, number, number] = [
        scope - Math.random() * scope * 2,
        scope - Math.random() * scope * 2,
        scope - Math.random() * scope * 2,
      ]

      if (
        !positions.some((existing) => {
          const distance = Math.sqrt(
            (position[0] - existing[0]) ** 2 + (position[1] - existing[1]) ** 2 + (position[2] - existing[2]) ** 2,
          )
          return distance < minDistance
        })
      ) {
        positions.push(position)
      }
    }

    return positions
  }

  // 데이터가 변경될 때 초기 설정
  useEffect(() => {
    if (datas.length > 0) {
      targetPositions.current = generateNonOverlappingPositions(datas.length, SCOPE, MIN_DISTANCE)
      currentPositions.current = Array(datas.length)
        .fill(null)
        .map((_, i) => ({
          x: targetPositions.current[i][0],
          y: INITIAL_Y,
          z: targetPositions.current[i][2],
        }))

      setBalloonPositions(currentPositions.current.map((pos) => [pos.x, pos.y, pos.z]))
      animationStarted.current = true
    }
  }, [datas])

  useFrame((state, delta) => {
    if (!animationStarted.current || datas.length === 0) return

    let updated = false
    const newPositions = currentPositions.current.map((pos, index) => {
      const target = targetPositions.current[index]

      const newY = pos.y + (target[1] - pos.y) * 0.02
      const newX = pos.x + (target[0] - pos.x) * 0.02
      const newZ = pos.z + (target[2] - pos.z) * 0.02

      if (Math.abs(newY - pos.y) > 0.001 || Math.abs(newX - pos.x) > 0.001 || Math.abs(newZ - pos.z) > 0.001) {
        updated = true
      }

      return {
        x: newX,
        y: newY,
        z: newZ,
      }
    })

    if (updated) {
      currentPositions.current = newPositions
      setBalloonPositions(newPositions.map((pos) => [pos.x, pos.y, pos.z]))
    }
  })

  return (
    <>
      {datas.map((data, i) => (
        <group rotation={[0, -Math.PI / 3, 0]} key={data.id}>
          <Balloon
            position={balloonPositions[i] || [0, INITIAL_Y, 0]}
            key={data.id}
            color={data.color}
            text={data.message}
            textSize={data.text_size}
            fontWeight={data.font_weight}
            textColor={data.text_color}
            fontStyle={data.font_style}
            //풍선 클릭시 해당 풍선으로 카메라 이동
            onClick={() => {
              setSelectedBalloon(data.id)
            }}
          />
        </group>
      ))}
    </>
  )
}
