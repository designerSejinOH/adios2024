'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './Icon'
import classNames from 'classnames'

export const Modal = ({
  title,
  isOpen,
  onClose,
  children,
}: {
  title: string
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className='absolute z-50 bottom-0 rounded-t-[36px] pt-8 px-5  w-full h-fit max-h-[60%] bg-trueGray-800 border-t border-l border-r border-gray-500 border-b-none flex flex-col space-y-6 justify-center items-center shadow-modal'
        >
          <div className='w-full h-fit flex flex-row justify-between items-center space-x-4 text-gray-200'>
            <span className='text-2xl font-bold leading-6'>{title}</span>
            <Icon icon='close' size={24} onClick={onClose} />
          </div>
          <div className='w-full h-fit  flex flex-col space-y-3 overflow-y-scroll pb-20'>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export const PureModal = ({
  isOpen,
  children,
  onClose,
  className,
}: {
  isOpen: boolean
  children?: React.ReactNode
  onClose: () => void
  className?: string
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={classNames(
            'bottom-0 z-50 w-full flex justify-center items-end h-full bg-black bg-opacity-50 ',
            'fixed',
          )}
          onClick={
            onClose
              ? (e) => {
                  e.stopPropagation()
                  onClose()
                }
              : undefined
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className={classNames(
              ' rounded-t-[36px]   relative  bg-trueGray-800  flex flex-col justify-start items-center shadow-modal',
              className ? className : 'gap-4 w-full h-full',
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
