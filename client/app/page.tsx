'use client'

import { Loading } from '@/components/dom'
import { Box } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

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
  return (
    <div className='w-screen h-screen flex flex-col md:flex-row items-center'>
      <div className='fixed top-0 left-0 flex w-full h-fit flex-row justify-between items-center'>
        <h1 className='text-4xl font-bold leading-tight hover:opacity-50 cursor-pointer'>아디오스 2024</h1>
      </div>

      <div className='w-full h-full flex justify-center items-center bg-gray-200'>
        <View orbit className='flex h-full w-full flex-col items-center justify-center'>
          <Suspense fallback={null}>
            <Box args={[1, 1, 1]} />
            <Common color={undefined} />
          </Suspense>
        </View>
      </div>

      <div className='flex w-full md:w-1/3 md:min-w-96 h-1/3 min-h-64 md:h-full overflow-y-scroll flex-col items-center'></div>
    </div>
  )
}
