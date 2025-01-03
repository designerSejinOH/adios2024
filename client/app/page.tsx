'use client'

import { BottomSheet, Icon, Loading } from '@/components/dom'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
import { Suspense, use, useEffect, useRef, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { AnimatePresence, motion } from 'framer-motion'
import { addMessage } from '@/lib/api'
import { Scene } from './Scene'
import { MdInfoOutline } from 'react-icons/md'
import { IoCaretDownOutline } from 'react-icons/io5'
import { IoCaretUpOutline } from 'react-icons/io5'
import { BsFillBalloonFill } from 'react-icons/bs'
import { VscTextSize } from 'react-icons/vsc'
import Wheel from '@uiw/react-color-wheel'
import ShadeSlider from '@uiw/react-color-shade-slider'
import { hsvaToHex, hexToHsva } from '@uiw/color-convert'
import classNames from 'classnames'
import { ThreeDots } from 'react-loader-spinner'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='z-50 top-0 bg-black left-0 fixed w-screen h-dvh flex items-center justify-center'>
      <Loading />
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

const textColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#FFFFFF', '#000000']

export default function Page() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [colorDropdown, setColorDropdown] = useState(false)
  const [textOption, setTextOption] = useState(false)
  const [isDepature, setIsDepature] = useState(false)
  const [isBalloonGone, setIsBalloonGone] = useState(false)

  const [message, setMessage] = useState('')
  const [color, setColor] = useState('#FF0000')
  const [textSize, setTextSize] = useState(0.25)
  const [textColor, setTextColor] = useState('#000000')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    try {
      await addMessage({
        message,
        color,
        text_size: textSize,
        text_color: textColor,
      })
      setError(null)
      setIsSheetOpen(false)
      setIsDepature(true)
      setLoading(false)
      if (isBalloonGone) {
        setMessage('')
        setColor('#FF0000')
        setTextSize(0.25)
        setTextColor('#000000')
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const textarea = useRef<HTMLTextAreaElement>(null)

  const handleFocus = () => {
    if (textarea.current) textarea.current.style.height = 'fit-content'
  }
  const handleBlur = () => {
    if (textarea.current) textarea.current.style.height = 'auto'
  }

  useEffect(() => {
    if (isBalloonGone) {
      console.log('balloon is gone')
    }
  }, [isBalloonGone])

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
              textColor={textColor}
              isSheetOpen={isSheetOpen}
              isDepature={isDepature}
              setIsBalloonGone={(isBalloonGone) => {
                setIsBalloonGone(isBalloonGone)
              }}
              onHandleObject={() => setIsSheetOpen(!isSheetOpen)}
            />
          </Suspense>
        </View>
      </div>
      <AnimatePresence>
        {isBalloonGone && (
          <motion.div className='w-fit h-fit fixed z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <span className='text-white text-xl font-pretendard'>풍선이 날아갔습니다!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={classNames(
          'w-[90vw] max-w-96 h-fit absolute z-10 bottom-6 left-1/2 transform -translate-x-1/2 ',
          'flex flex-row justify-between items-center pl-4 pr-4 py-3',
          'bg-white rounded-3xl',
        )}
      >
        <form onSubmit={handleSubmit} className='w-full h-fit flex flex-row justify-start items-center  gap-1'>
          <div
            onClick={() => setColorDropdown(!colorDropdown)}
            className='w-fit h-fit relative text-xl flex flex-row justify-center items-center gap-1'
          >
            <div
              style={{ color: color }}
              className='w-fit h-fit text-lg md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
            >
              <Icon icon='balloon' />
            </div>
            <BottomSheet
              isOpen={colorDropdown}
              height='fit'
              onClose={() => setColorDropdown(false)}
              className='flex justify-center items-center px-6 pt-4 pb-6 gap-6'
            >
              <div
                style={{
                  color: color,
                }}
                className='w-fit h-fit '
              >
                <Icon icon='balloon' size={36} />
              </div>
              <Wheel color={hexToHsva(color)} onChange={(colorResult) => setColor(hsvaToHex(colorResult.hsva))} />
              <ShadeSlider
                hsva={hexToHsva(color)}
                style={{ width: 210, marginTop: 20 }}
                onChange={(newShade) => {
                  const hsvaColor = hexToHsva(color)
                  hsvaColor.v = newShade.v
                  setColor(hsvaToHex(hsvaColor))
                }}
              />
              <button
                onClick={() => setTextOption(false)}
                className='w-full mt-4 h-fit text-nowrap rounded-2xl text-md py-3 px-4 bg-black text-white cursor-pointer md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
              >
                확인
              </button>
            </BottomSheet>
          </div>
          <div className='w-fit h-fit relative text-lg flex flex-row justify-center items-center gap-1'>
            <div
              onClick={() => setTextOption(!textOption)}
              className='w-fit h-fit md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
            >
              <Icon icon='text' />
            </div>
            <BottomSheet
              isOpen={textOption}
              height='fit'
              onClose={() => setTextOption(false)}
              className='flex justify-center items-center px-6 pt-4 pb-6 gap-6'
            >
              <div
                style={{
                  color: textColor,
                  fontSize:
                    textSize === 0.1
                      ? '1rem'
                      : textSize === 0.2
                        ? '1.2rem'
                        : textSize === 0.25
                          ? '1.3rem'
                          : textSize === 0.4
                            ? '1.5rem'
                            : '1.7rem',
                }}
                className='w-full rounded-xl  h-fit flex flex-row justify-center items-center gap-1'
              >
                <p className='p-2'>{message ? message : '안녕, Hello'}</p>
              </div>
              <div className='w-full h-fit flex flex-row justify-center items-center gap-1'>
                <Icon icon='text' className='mr-1' size={32} />
                {[0.1, 0.2, 0.25, 0.4, 0.5].map((size) => (
                  <div
                    key={size}
                    onClick={() => {
                      setTextSize(size)
                    }}
                    className={classNames(
                      'w-fit   h-fit px-2 py-1 text-black  font-pretendard rounded-xl flex justify-center items-center gap-1 text-sm cursor-pointer md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out',
                      size === textSize && 'bg-black text-white',
                    )}
                  >
                    {size * 100}%
                  </div>
                ))}
              </div>
              <div className='w-full h-fit flex flex-row justify-center items-center gap-2'>
                {textColors.map((color) => (
                  <div
                    key={color}
                    onClick={() => {
                      setTextColor(color)
                    }}
                    className={classNames(
                      'w-6 h-6 rounded-full cursor-pointer flex justify-center items-center md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out',
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {textColor === color && <div className='w-3 h-3 rounded-full bg-white shadow-md' />}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setTextOption(false)}
                className='w-full mt-4 h-fit text-nowrap rounded-2xl text-md py-3 px-4 bg-black text-white cursor-pointer md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
              >
                확인
              </button>
            </BottomSheet>
          </div>
          <textarea
            ref={textarea}
            rows={1}
            className='w-full mx-1 h-fit text-md px-2 py-1.5 rounded-xl text-black cursor-pointer placeholder:text-gray-500 focus:bg-gray-100'
            value={message}
            maxLength={108}
            placeholder='새해 소망을 적어 보세요.'
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            required
          />
          <button
            type='submit'
            className='w-fit h-fit text-nowrap rounded-xl text-sm py-2 px-4 bg-black text-white cursor-pointer'
          >
            {loading ? (
              <ThreeDots visible={true} color='#fff' width={20} height={20} ariaLabel='tail-spin-loading' radius='9' />
            ) : (
              '보내기'
            )}
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
      <div className='flex w-fit h-fit flex-col justify-start items-start px-4 py-2 cursor-pointer'>
        <div
          onClick={() => window.location.reload()}
          className='text-4xl w-fit h-fit text-nowrap flex flex-row gap-1 font-[establishRetrosansOTF] text-white font-bold md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
        >
          GOODBYE 2024
        </div>
        <div
          onClick={() => setIsInfoOpen(true)}
          className='w-fit h-fit flex flex-row gap-1 justify-center items-center text-white md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
        >
          <Icon size={16} icon='logo' />
          <span className='text-md font-[establishRetrosansOTF] '>2025년 새해 프로젝트</span>
        </div>
      </div>

      <BottomSheet
        height='fit'
        className='flex justify-center items-center px-6 pt-4 pb-6 gap-6'
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      >
        <div className='w-full h-fit flex flex-col justify-center items-center gap-4 p-4'>
          <div className='w-full h-fit flex flex-col justify-center items-center gap-4'>
            <div className='w-full h-fit flex flex-row justify-center items-center gap-1'>
              <BsFillBalloonFill className='text-3xl' />
              <span className='text-4xl font-[establishRetrosansOTF]'>GOODBYE 2024</span>
            </div>
            <div className='w-full h-fit flex flex-col justify-center items-center gap-4'>
              <span className='text-lg font-pretendard'>2025년 새해 프로젝트</span>
              <span className='text-sm font-pretendard'>2024년을 기억하며 2025년 새해 소망을 날려보세요.</span>
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
