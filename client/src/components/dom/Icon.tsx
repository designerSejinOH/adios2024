import React from 'react'
import classNames from 'classnames'
import type { HTMLAttributes } from 'react'
import { createElement } from 'react'
import logo from '@/svg/logo.svg'
import balloon from '@/svg/balloon.svg'
import text from '@/svg/text.svg'
import check from '@/svg/check.svg'

export const icons = {
  logo: logo,
  balloon: balloon,
  text: text,
  check: check,
}

interface IconProps {
  icon: string
  color?: string
  size?: number
  className?: string
  motion?: boolean
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const Icon = ({ icon, color, size = 24, className, onClick, motion = true, ...rest }: IconProps) => {
  const baseIconClasses = ' flex items-center justify-center cursor-pointer '

  if (!icons[icon]) return null

  return (
    <div
      aria-label={icon}
      className={classNames(
        baseIconClasses,
        motion ? 'transition-all duration-200 ease-in-out focus:opacity-50 active:opacity-50 active:scale-90' : '',
      )}
      onClick={onClick}
      {...rest}
    >
      {createElement(icons[icon], {
        style: {
          width: size.toString(),
        },
        className: className,
      })}
    </div>
  )
}
