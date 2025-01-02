'use client'

import { BottomSheet, Icon, Loading } from '@/components/dom'
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

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FFD700', '#FF33FF', '#33FFFF', '#3357FF']

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
  const [textSize, setTextSize] = useState(0.25)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addMessage({ message, color, text_size: textSize })
      setError(null)
      setIsSheetOpen(false)
      setIsDepature(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className='w-screen max-h-dvh h-screen flex flex-col items-center'>
      <Header />
      <div className='w-full h-full flex justify-center items-center bg-gray-200'>
        <View orbit className='flex h-full w-full flex-col items-center justify-center'>
          <Suspense fallback={null}>
            <Scene
              color={color}
              text={message}
              textSize={textSize}
              isSheetOpen={isSheetOpen}
              isDepature={isDepature}
              onHandleObject={() => setIsSheetOpen(!isSheetOpen)}
            />
          </Suspense>
        </View>
      </div>
      <motion.div
        initial={{
          height: 0,
        }}
        animate={{
          height: isSheetOpen ? '50dvh' : 0,
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
          <div className='w-full h-fit flex flex-row justify-between items-center gap-4'>
            <div className='w-full h-fit flex flex-col gap-2 justify-start items-start'>
              <label className=''>풍선 색상</label>
              <div className='w-fit h-fit flex flex-row gap-2 justify-start items-center'>
                {colors.map((c) => (
                  <div
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`h-6 w-6 rounded-full cursor-pointer p-1.5`}
                  >
                    {color === c && <div className='w-full h-full bg-white rounded-full' />}
                  </div>
                ))}
              </div>
            </div>
            <div className='w-full h-fit flex flex-col gap-2 justify-start items-start'>
              <label className=''>글자 크기</label>
              <select
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                className='w-full p-2 border border-black rounded-none'
              >
                <option value={0.15}>0.15</option>
                <option value={0.2}>0.2</option>
                <option value={0.25}>0.25</option>
                <option value={0.3}>0.3</option>
                <option value={0.35}>0.35</option>
                <option value={0.4}>0.4</option>
                <option value={0.45}>0.45</option>
                <option value={0.5}>0.5</option>
              </select>
            </div>
          </div>
          <div className='w-full h-fit flex flex-col gap-2 justify-start items-start'>
            <label className=''>메세지</label>
            <textarea
              value={message}
              maxLength={108}
              onChange={(e) => setMessage(e.target.value)}
              required
              className='w-full h-fit min-h-40 p-2 border border-black rounded-none'
            />
          </div>
          <button
            type='submit'
            className='
            w-full h-fit py-4 text-lg bg-black text-white rounded-none cursor-pointer md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
          >
            메세지 보내기
          </button>
        </form>
      </motion.div>
    </div>
  )
}

const Header = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  return (
    <div className='fixed z-10 top-0 left-0 w-full h-fit flex flex-row justify-between items-center'>
      <div className='flex w-fit h-fit flex-col gap-1 justify-start items-start px-6 py-4 cursor-pointer'>
        <div
          onClick={() => window.location.reload()}
          className='text-4xl w-fit text-nowrap font-[establishRetrosansOTF] text-white font-bold md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
        >
          GOODBYE 2024
        </div>
        <div
          onClick={() => setIsInfoOpen(true)}
          className='w-fit h-fit flex flex-row justify-center items-center gap-1 text-white md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
        >
          <MdInfoOutline />
          <span className='text-lg font-pretendard '>아디오스 2024 프로젝트</span>
        </div>
      </div>
      <div className='w-fit px-6 py-4 text-white h-fit flex flex-row justify-center items-center cursor-pointer'>
        <Icon icon='logo' size={32} />
      </div>
      <BottomSheet height='fit' isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)}>
        <div className='w-full h-fit flex flex-col justify-center items-center gap-4 p-4'>
          <div className='w-full h-fit flex flex-col justify-center items-center gap-4'>
            <div className='w-full h-fit flex flex-row justify-center items-center gap-1'>
              <BsFillBalloonFill className='text-3xl' />
              <span className='text-4xl font-[establishRetrosansOTF]'>GOODBYE 2024</span>
            </div>
            <div className='w-full h-fit flex flex-col justify-center items-center gap-4'>
              <span className='text-lg font-pretendard'>아디오스 2024 프로젝트</span>
              <span className='text-lg font-pretendard'>2024년을 기억하며 2025년 새해 소망을 날려보세요.</span>
              <p className='p-4 text-center font-pretendard break-keep'>
                이 프로젝트는 2024년을 끝으로 2025년을 맞이하는 굿바이 2024 프로젝트입니다. 우리는 보통 어떠한 일을
                기억하거나 소원을 빌 때, 하늘에 소원을 빌며 기억하곤 합니다. 그런 이벤트 중 하나가 바로 풍선에 소원을
                적고 날리는 것입니다. 하지만 풍선을 하늘에 떠나 보내는 것은 환경오염에 큰 영향을 줄 수 있습니다. 그래서
                최근에는 환경보호단체에서 해당 이벤트를 금지하고 있습니다. &apos;아디오스 2024&apos;는 이러한 환경오염을
                줄이기 위해 풍선 대신 인터넷에 소원을 올리고, 이를 하늘에 띄우는 프로젝트입니다.
              </p>

              <p className='p-4 font-pretendard'>
                Designed and developed by{' '}
                <a href='https://www.sejinoh.site' target='_blank' rel='noreferrer' className='text-blue-500'>
                  SEJIN OH
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
