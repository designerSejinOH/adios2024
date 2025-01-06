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
import classNames from 'classnames'

export default function Page() {
  const router = useRouter()
  const [datas, setDatas] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedBalloon, setSelectedBalloon] = useState<string | null>(null)
  const BALLOONS_PER_PAGE = 10

  const getMessagesData = async () => {
    const messages = await getMessages()
    // created_at을 기준으로 최신순 정렬
    const sortedMessages = messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    setDatas(sortedMessages)
  }

  useEffect(() => {
    getMessagesData()
  }, [])

  // 현재 페이지의 데이터만 가져오기
  const currentDatas = useMemo(() => {
    const start = currentPage * BALLOONS_PER_PAGE
    return datas.slice(start, start + BALLOONS_PER_PAGE)
  }, [datas, currentPage])

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(datas.length / BALLOONS_PER_PAGE)

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
              datas={currentDatas}
              setSelectedBalloon={(id) => {
                setSelectedBalloon(id)
              }}
            />
            <Environment preset='city' />
            <Sky sunPosition={[0, 10, 0]} />
          </Suspense>
        </View>
      </div>
      {/* 페이지네이션 컨트롤 */}
      {totalPages > 1 && (
        <div className='fixed bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col gap-3 mb-4 z-20 flex w-1/2 h-fit justify-center items-center'>
          {/* <AnimatePresence>
            {selectedBalloon && (
              <motion.div className=' pl-3 pr-4 py-3 flex flex-col justify-center items-end gap-2 w-fit h-fit bg-white/70 backdrop-blur-sm rounded-2xl'>
                <div className='w-full h-fit flex flex-row justify-center items-start gap-1 '>
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
          </AnimatePresence> */}
          <button
            onClick={() => {
              router.push('/')
            }}
            className=' w-full h-fit text-white pl-3 pr-4 rounded-2xl flex flex-row gap-1 justify-center items-center  font-[pretendard] md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out '
          >
            <Icon icon='balloon' className='' size={16} />
            <span className=''>메세지 보내기</span>
          </button>

          <div className='flex flex-row w-full h-fit justify-between items-center gap-4 text-black text-sm bg-white/50 backdrop-blur-sm rounded-2xl px-2 py-3 font-pretendard'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className=' px-3 text-nowrap rounded-lg disabled:opacity-30 opacity-70 hover:bg-white/20'
            >
              이전
            </button>
            <span className=' px-2 text-nowrap'>
              <span className={classNames(currentPage + 1 === totalPages ? 'opacity-70' : 'opacity-50')}>
                {currentPage + 1}
              </span>{' '}
              <span className='opacity-50'>/</span> <span className='opacity-70'>{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className=' px-3 text-nowrap rounded-lg disabled:opacity-30 opacity-70 hover:bg-white/20'
            >
              다음
            </button>
          </div>
        </div>
      )}
      <div className='fixed top-24 left-1/2 -translate-x-1/2 z-20 w-fit h-fit flex flex-row justify-center items-center text-white text-sm'>
        전체 {datas.length}개 중 {currentDatas.length}개
      </div>
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
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 })
  const { camera } = useThree()
  const [balloonPositions, setBalloonPositions] = useState<[number, number, number][]>([])
  const targetPositions = useRef<[number, number, number][]>([])
  const currentPositions = useRef<{ x: number; y: number; z: number }[]>([])
  const animationStarted = useRef(false)

  const MIN_DISTANCE = 1.5
  const SCOPE = 2
  const INITIAL_Y = -10
  const VISIBILITY_THRESHOLD = 20 // 카메라와의 거리 임계값

  const generateNonOverlappingPositions = (count: number, scope: number, minDistance: number) => {
    const positions: [number, number, number][] = []
    let maxAttempts = count * 100 // 무한 루프 방지를 위한 최대 시도 횟수

    const createRandomPosition = (): [number, number, number] => [
      scope - Math.random() * scope * 2, // x: -scope to scope
      scope - Math.random() * scope * 2, // y: -scope to scope
      scope - Math.random() * scope * 2, // z: -scope to scope
    ]

    const checkDistance = (pos1: [number, number, number], pos2: [number, number, number]): number => {
      return Math.sqrt(Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2) + Math.pow(pos1[2] - pos2[2], 2))
    }

    while (positions.length < count && maxAttempts > 0) {
      const newPosition = createRandomPosition()
      let isValid = true

      // 기존 위치들과의 거리 검사
      for (const existingPos of positions) {
        if (checkDistance(newPosition, existingPos) < minDistance) {
          isValid = false
          break
        }
      }

      if (isValid) {
        positions.push(newPosition)
      }

      maxAttempts--
    }

    // 충분한 위치를 찾지 못한 경우, 남은 위치들을 기본 그리드에 배치
    while (positions.length < count) {
      const gridIndex = positions.length
      const gridSize = Math.ceil(Math.pow(count, 1 / 3))
      const x = ((gridIndex % gridSize) - gridSize / 2) * minDistance
      const y = ((Math.floor(gridIndex / gridSize) % gridSize) - gridSize / 2) * minDistance
      const z = (Math.floor(gridIndex / (gridSize * gridSize)) - gridSize / 2) * minDistance
      positions.push([x, y, z])
    }

    return positions
  }

  // 모든 풍선의 위치를 생성하되, 화면에 보이는 것만 렌더링
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

  // 카메라 위치에 따라 보이는 풍선 결정
  useFrame(() => {
    if (!animationStarted.current || datas.length === 0) return

    // 위치 업데이트 로직
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

    // 카메라와의 거리에 따라 보이는 풍선 결정
    const visibleBalloons = currentPositions.current
      .map((pos, index) => ({
        index,
        distance: new THREE.Vector3(pos.x, pos.y, pos.z).distanceTo(camera.position),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10)
      .map((item) => item.index)

    const minIndex = Math.min(...visibleBalloons)
    const maxIndex = Math.max(...visibleBalloons)
    setVisibleRange({ start: minIndex, end: maxIndex + 1 })
  })

  const visibleBalloons = useMemo(() => {
    return datas.slice(visibleRange.start, visibleRange.end)
  }, [datas, visibleRange])

  return (
    <>
      {visibleBalloons.map((data, i) => (
        <group rotation={[0, -Math.PI / 3, 0]} key={data.id}>
          <Balloon
            position={balloonPositions[i + visibleRange.start] || [0, INITIAL_Y, 0]}
            color={data.color}
            text={data.message}
            textSize={data.text_size}
            fontWeight={data.font_weight}
            textColor={data.text_color}
            fontStyle={data.font_style}
            onClick={() => {
              setSelectedBalloon(data.id)
            }}
          />
        </group>
      ))}
    </>
  )
}
