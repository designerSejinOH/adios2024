'use client'

import classNames from 'classnames'
import { AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { Sheet } from 'react-modal-sheet'
import Image from 'next/image'

export interface BottomSheetProps {
  isOpen: boolean
  className?: string
  onClose?: () => void
  children: React.ReactNode
  onCloseEnd?: () => void
}

export const BottomSheet = ({ children, isOpen, onClose, onCloseEnd }: BottomSheetProps) => {
  return (
    <Sheet isOpen={isOpen} onClose={onClose} onCloseEnd={onCloseEnd}>
      <Sheet.Container className='rounded-t-4xl pt-safe relative size-full overflow-hidden'>{children}</Sheet.Container>
      <Sheet.Backdrop className='' />
    </Sheet>
  )
}

export const SheetHeader = ({ children, className, ...props }: { children?: React.ReactNode; className?: string }) => {
  if (!children) return <Sheet.Header />
  return <Sheet.Header className={className}>{children}</Sheet.Header>
}

export const SheetContent = ({
  disableDrag,
  children,
  className,
  ...props
}: {
  disableDrag?: boolean
  children: React.ReactNode
  className?: string
}) => {
  return (
    <Sheet.Content className={className} disableDrag={disableDrag}>
      {children}
    </Sheet.Content>
  )
}

export const SheetScroller = ({
  ref,
  children,
  className,
  ...props
}: {
  ref?: any
  children: React.ReactNode
  className?: string
}) => {
  return (
    <Sheet.Scroller ref={ref} className={className}>
      {children}
    </Sheet.Scroller>
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
