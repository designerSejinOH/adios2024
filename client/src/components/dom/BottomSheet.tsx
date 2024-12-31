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
  scrollable?: boolean
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
  scrollable,
}: BottomSheetProps) => {
  const [isHandling, setIsHandling] = useState(false)

  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container
        className={classNames(
          'h-fit',
          'bg-transparent bg-sheet-gradient backdrop-blur-xl rounded-[36px]  shadow-[0px_-16px_20px_0px_rgba(0,0,0,0.12),0px_-8px_16px_0px_rgba(0,0,0,0.08),0px_0px_8px_0px_rgba(0,0,0,0.08)]',
        )}
      >
        {height !== 'screen' && (
          <Sheet.Header
            onPanStart={() => setIsHandling(true)}
            onPanEnd={() => setIsHandling(false)}
            className='py-3 flex flex-col justify-center items-center text-gray-500 '
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
            {title && <SheetTitle size={size} alignMode={alignMode} title={title} onClose={onClose} />}
          </Sheet.Header>
        )}
        <Sheet.Content
          onPanStart={() => !scrollable && setIsHandling(true)}
          onPanEnd={() => !scrollable && setIsHandling(false)}
          disableDrag={scrollable}
          className={classNames('h-fit w-full')}
        >
          <Sheet.Scroller
            className={classNames(
              'w-full  flex flex-col justify-start items-center gap-4',
              'overflow-y-hidden h-fit',
              className,
            )}
          >
            {children}
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  )
}

const SheetTitle = ({
  size = 'md',
  alignMode = 'left',
  title,
  className,
  onClose,
}: {
  size: 'sm' | 'md' | 'lg'
  alignMode?: 'left' | 'center'
  title: string
  className?: string
  onClose?: () => void
}) => {
  if (size === 'sm') {
    return null
  } else if (size === 'md') {
    return (
      <div
        className={classNames(
          'w-full h-fit bg-gray-900 rounded-[42px] p-5 flex flex-row justify-between items-center',
          className,
        )}
      >
        <div
          onClick={onClose}
          className='w-12 aspect-square p-2.5  rounded-full flex  bg-gray-800 justify-center items-center active:bg-primary-200 active:text-black active:scale-95 transition-all duration-200'
        >
          <Icon icon='arrowLeft' size={28} motion={false} />
        </div>
        <div className='w-full px-3 py-2.5 h-fit flex flex-col justify-center items-center space-y-0.5'>
          <span className='text-primary-200 text-xl font-semibold leading-6'>{title}</span>
        </div>
        <div className='min-w-12 min-h-12 '></div>
      </div>
    )
  } else {
    return (
      <div
        className={classNames(
          'w-full h-fit pl-0 pr-7 py-4 flex flex-row items-center',
          alignMode === 'center' ? 'justify-center' : 'justify-between',
          className,
        )}
      >
        <div className='w-fit h-16 pl-8 flex flex-col justify-center items-start gap-0.5'>
          <span className='text-primary-200 text-2xl font-semibold leading-6'>{title}</span>
        </div>

        {alignMode === 'left' && (
          <div
            onClick={onClose}
            className='w-12 h-12 p-2 rounded-full flex  bg-gray-700 justify-center items-center active:opacity-70 active:scale-95 transition-all duration-200'
          >
            <Icon icon='close' className='text-white' size={28} motion={false} />
          </div>
        )}
      </div>
    )
  }
}
