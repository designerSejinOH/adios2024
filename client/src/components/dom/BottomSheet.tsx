'use client'

import classNames from 'classnames'
import { Icon } from './Icon'
import { AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Sheet } from 'react-modal-sheet'
import Image from 'next/image'

export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  height?: 'full' | 'fit' | 'screen'
  size?: 'sm' | 'md' | 'lg'
  alignMode?: 'left' | 'center'
  title?: string
  children: React.ReactNode
  className?: string
  draggable?: boolean
}

export const BottomSheet = ({
  isOpen,
  height = 'fit',
  size = 'lg',
  alignMode = 'left',
  onClose,
  title,
  children,
  className,
  draggable = false,
}: BottomSheetProps) => {
  const [isHandling, setIsHandling] = useState(false)

  return (
    <Sheet isOpen={isOpen} onClose={onClose} detent='content-height'>
      <Sheet.Container
        style={{
          backgroundColor: '#f0f0f0',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
        }}
      >
        <Sheet.Header
          onPanStart={() => setIsHandling(true)}
          onPanEnd={() => setIsHandling(false)}
          className='py-3 flex flex-col justify-center items-center text-black'
        >
          <div className='w-fit h-[10px] flex justify-center items-center'>
            {isHandling ? (
              <svg xmlns='http://www.w3.org/2000/svg' className='w-[60px] h-[10px]' viewBox='0 0 60 10'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M0.0367723 1.60809C0.239855 0.525014 1.22764 -0.177393 2.24305 0.0392228L30 5.96055L57.757 0.0392228C58.7724 -0.177393 59.7601 0.525014 59.9632 1.60809C60.1663 2.69117 59.5078 3.74478 58.4924 3.96139L30.3677 9.96116C30.125 10.0129 29.875 10.0129 29.6323 9.96116L1.50763 3.96139C0.492213 3.74478 -0.16631 2.69117 0.0367723 1.60809Z'
                  fill='currentColor'
                />
              </svg>
            ) : (
              <svg xmlns='http://www.w3.org/2000/svg' className='w-[60px] h-[4px]' viewBox='0 0 60 4'>
                <path
                  d='M0 2C0 0.895431 0.895431 0 2 0H58C59.1046 0 60 0.895431 60 2C60 3.10457 59.1046 4 58 4H2C0.895432 4 0 3.10457 0 2Z'
                  fill='currentColor'
                />
              </svg>
            )}
          </div>
        </Sheet.Header>
        <Sheet.Content disableDrag={!draggable} className={classNames('w-full h-fit', className)}>
          {children}
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  )
}

export const useScrolling = () => {
  const [isScrolling, setScrolling] = useState<boolean>(false)
  const timeout = useRef<any>()

  const onScroll = () => {
    setScrolling(true)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setScrolling(false), 150)
  }

  return { onScroll, isScrolling }
}

export const useTouching = () => {
  const [isTouching, setTouching] = useState<boolean>(false)
  const timeout = useRef<any>()

  const onTouchStart = () => {
    setTouching(true)
    clearTimeout(timeout.current)
  }

  const onTouchEnd = () => {
    timeout.current = setTimeout(() => setTouching(false), 500)
  }

  return { onTouchStart, onTouchEnd, isTouching }
}
