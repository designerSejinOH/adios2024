'use client'

import { BottomSheet, Loading } from '@/components/dom'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
import { Suspense, useRef, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { motion } from 'framer-motion'
import { addMessage } from '@/lib/api'
import { Scene } from './Scene'
import { MdInfoOutline } from 'react-icons/md'
import { IoCaretDownOutline } from 'react-icons/io5'
import { IoCaretUpOutline } from 'react-icons/io5'
import { BsFillBalloonFill } from 'react-icons/bs'
import { is } from '@react-three/fiber/dist/declarations/src/core/utils'

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FFD700'] // 사용 가능한 색상

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
  const [isDepature, setIsDepature] = useState(false)

  const [message, setMessage] = useState('')
  const [color, setColor] = useState(colors[0])
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addMessage({ message, color })
      setMessage('')
      setColor(colors[0])
      setError(null)
      setIsSheetOpen(false)
      setIsDepature(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className='w-screen h-screen flex flex-col items-center'>
      <Header />
      <div className='w-full h-full flex justify-center items-center bg-gray-200'>
        <View orbit className='flex h-full w-full flex-col items-center justify-center'>
          <Suspense fallback={null}>
            <Scene
              color={color}
              isSheetOpen={isSheetOpen}
              isDepature={isDepature}
              onHandleObject={() => setIsSheetOpen(!isSheetOpen)}
            />
          </Suspense>
        </View>
      </div>
      <motion.div
        animate={{
          height: isSheetOpen ? 'fit-content' : 0,
        }}
        transition={{ duration: 0.5 }}
        className='w-full flex flex-col justify-start items-start relative bg-white'
      >
        <div
          onClick={() => setIsSheetOpen(!isSheetOpen)}
          className='absolute z-10 -top-10 left-0 w-full h-fit flex flex-row justify-center items-center gap-1 md:hover:text-white active:text-white transition-all duration-200 ease-in-out cursor-pointer'
        >
          {!isSheetOpen ? <IoCaretUpOutline /> : <IoCaretDownOutline />}
          <span className='text-lg font-pretendard'>
            {!isSheetOpen ? '풍선을 클릭해 새해 소망을 적어 보세요.' : '풍선을 날리면 하늘로 날아갑니다.'}
          </span>
        </div>
        <form onSubmit={handleSubmit} className='w-full h-fit flex flex-col justify-center items-center gap-4 p-4'>
          {error && <div className='text-red-500'>{error}</div>}
          <div>
            <label className='block mb-2'>Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className='w-full p-2 border rounded'
            />
          </div>
          <div>
            <label className='block mb-2'>Color</label>
            <select value={color} onChange={(e) => setColor(e.target.value)} className='w-full p-2 border rounded'>
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button type='submit' className='px-4 py-2 bg-blue-500 text-white rounded'>
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  )
}

const Header = () => {
  return (
    <div className='fixed z-10 top-0 left-1/2 -translate-x-1/2 flex w-fit h-fit flex-col gap-1 justify-center items-center py-6 cursor-pointer'>
      <div
        onClick={() => window.location.reload()}
        className='text-4xl w-fit text-nowrap font-[establishRetrosansOTF] text-white font-bold md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
      >
        GOODBYE 2024
      </div>
      <div className='w-fit h-fit flex flex-row justify-center items-center gap-1 text-white md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'>
        <MdInfoOutline />
        <span className='text-lg font-pretendard '>아디오스 2024 프로젝트</span>
      </div>
    </div>
  )
}
