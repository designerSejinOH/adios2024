'use client'

import { BottomSheet, Icon, Loading, Header } from '@/components/dom'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
import { Suspense, use, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { addMessage } from '@/lib/api'
import { Scene } from './Scene'
import Wheel from '@uiw/react-color-wheel'
import ShadeSlider from '@uiw/react-color-shade-slider'
import { hsvaToHex, hexToHsva } from '@uiw/color-convert'
import classNames from 'classnames'
import { ThreeDots } from 'react-loader-spinner'
import { useRouter } from 'next/navigation'

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='z-50 top-0 bg-white left-0 fixed w-screen h-dvh flex items-center justify-center'>
      <Loading />
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

const textColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#FFFFFF', '#000000']

export default function Page() {
  const router = useRouter()

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [colorDropdown, setColorDropdown] = useState(false)
  const [textOption, setTextOption] = useState(false)
  const [isDepature, setIsDepature] = useState(false)
  const [isBalloonGone, setIsBalloonGone] = useState(false)

  const [message, setMessage] = useState('')
  const [color, setColor] = useState('#FF0000')
  const [textSize, setTextSize] = useState(0.25)
  const [textColor, setTextColor] = useState('#000000')
  const [fontStyle, setFontStyle] = useState('sans-serif')
  const [fontWeight, setFontWeight] = useState('medium')
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
        font_weight: fontWeight,
        font_style: fontStyle,
      })
      setError(null)
      setIsSheetOpen(false)
      setIsDepature(true)
      setLoading(false)
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
      setMessage('')
      setColor('#FF0000')
      setTextSize(0.25)
      setTextColor('#000000')
      setFontStyle('sans-serif')
      setFontWeight('medium')
    }
  }, [isBalloonGone])

  return (
    <div className='w-screen max-h-dvh h-screen flex flex-col justify-center items-start'>
      <Header />
      <div className='w-full h-full flex justify-center items-start bg-gray-200'>
        <View
          orbit
          className={classNames(
            'flex w-full flex-col items-center justify-center transition-all duration-200 ease-in-out',
            colorDropdown || textOption ? 'h-1/2' : 'h-full',
          )}
        >
          <Suspense fallback={null}>
            <Scene
              color={color}
              text={message}
              textSize={textSize}
              fontWeight={fontWeight}
              textColor={textColor}
              fontStyle={fontStyle}
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
          <motion.div
            initial={{ opacity: 0, scale: 0.5, transformOrigin: 'center', transform: 'translate(-50%, -50%)' }}
            animate={{ opacity: 1, scale: 1, transformOrigin: 'center', transform: 'translate(-50%, -50%)' }}
            exit={{ opacity: 0, scale: 0.5, transformOrigin: 'center', transform: 'translate(-50%, -50%)' }}
            className='w-fit h-fit fixed z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 justify-center items-center'
          >
            <span className='text-white text-xl font-pretendard'>풍선이 날아갔습니다!</span>
            <div
              onClick={() => {
                router.push('/balloons')
              }}
              className='w-fit h-fit pl-3 pr-5 py-3 flex justify-center items-center bg-white text-black shadow-md text-lg rounded-3xl md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out cursor-pointer'
            >
              <Icon icon='logo' className='mr-1' size={36} />
              날아간 풍선 보러 가기
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        onClick={() => {
          router.push('/balloons')
        }}
        className='w-fit h-fit text-white bg-white/30 backdrop-blur-sm px-3 py-1 rounded-xl text-sm font-pretendard absolute z-20 flex justify-center items-center bottom-28 left-1/2 transform -translate-x-1/2 md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out cursor-pointer'
      >
        지금까지 날아간 풍선들 보기
      </div>

      <motion.div
        className={classNames(
          'w-[90vw] max-w-96 h-fit absolute z-10 bottom-8 left-1/2 transform -translate-x-1/2 ',
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
              onClick={() => setColorDropdown(false)}
              className='w-full mt-4 h-fit text-nowrap rounded-2xl text-md py-3 px-4 bg-black text-white cursor-pointer md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
            >
              확인
            </button>
          </BottomSheet>
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
              draggable
            >
              <div className='w-full h-fit flex pb-2 flex-col justify-between items-center gap-4'>
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
                    fontFamily: fontStyle === 'serif' ? `'NotoSerif', serif` : `'NotoSans', sans-serif`,
                    fontWeight: fontWeight === 'light' ? 300 : fontWeight === 'medium' ? 500 : 700,
                  }}
                  className={classNames(
                    'w-full bg-white rounded-xl p-4 h-fit flex flex-row justify-center items-center gap-1',
                  )}
                >
                  Abc, 가나다, 123
                </div>
                <div className='w-fit h-fit flex flex-col justify-start items-start gap-3'>
                  <div className='w-fit h-fit flex flex-row justify-center items-center gap-1'>
                    <Icon icon='textSize' className='mr-1' size={32} />
                    {[0.1, 0.2, 0.25, 0.4, 0.5].map((size) => (
                      <div
                        key={size}
                        onClick={() => {
                          setTextSize(size)
                        }}
                        className={classNames(
                          'w-fit   h-fit px-2 py-1 text-black  font-pretendard rounded-xl flex justify-center items-center gap-1 text-sm cursor-pointer md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out',
                          size === textSize && 'bg-[#ddd] text-black shadow-sm',
                        )}
                      >
                        {size * 100}%
                      </div>
                    ))}
                  </div>
                  <div className='w-fit h-fit flex flex-row justify-center items-center gap-1'>
                    <Icon icon='fontWeight' className='mr-1' size={32} />
                    {['light', 'medium', 'bold'].map((weight) => (
                      <div
                        key={weight}
                        onClick={() => {
                          setFontWeight(weight)
                        }}
                        className={classNames(
                          'w-fit   h-fit px-2 py-1 text-black  font-pretendard rounded-xl flex justify-center items-center gap-1 text-sm cursor-pointer md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out',
                          weight === fontWeight && 'bg-[#ddd] text-black shadow-sm',
                        )}
                      >
                        {weight === 'light' ? 'Light' : weight === 'medium' ? 'Medium' : 'Bold'}
                      </div>
                    ))}
                  </div>
                  <div className='w-fit h-fit flex flex-row justify-center items-center gap-1'>
                    <Icon icon='fontStyle' className='mr-1' size={32} />
                    {['serif', 'sans-serif'].map((style) => (
                      <div
                        key={style}
                        onClick={() => {
                          setFontStyle(style)
                        }}
                        style={{ fontFamily: style === 'serif' ? `'NotoSerif', serif` : `'NotoSans', sans-serif` }}
                        className={classNames(
                          'w-fit   h-fit px-2 py-1 text-black  font-pretendard rounded-xl flex justify-center items-center gap-1 text-sm cursor-pointer md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out',
                          style === fontStyle && 'bg-[#ddd] text-black shadow-sm',
                        )}
                      >
                        {style === 'serif' ? '명조체' : '고딕체'}
                      </div>
                    ))}
                  </div>
                  <div className='w-fit mt-2 h-fit flex flex-row justify-center items-center gap-2'>
                    {textColors.map((color) => (
                      <div
                        key={color}
                        onClick={() => {
                          setTextColor(color)
                        }}
                        className={classNames(
                          'w-5 h-5 rounded-full cursor-pointer flex justify-center items-center md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out',
                        )}
                        style={{ backgroundColor: color }}
                      >
                        {textColor === color && <div className='w-2.5 h-2.5 rounded-full bg-white border' />}
                      </div>
                    ))}
                  </div>
                </div>
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
            placeholder='메시지를 보내세요.'
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
