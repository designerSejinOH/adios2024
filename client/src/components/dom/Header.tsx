import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BottomSheet, Icon } from '@/components/dom'
import Image from 'next/image'

export const Header = () => {
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const router = useRouter()

  return (
    <div className='fixed z-10 top-0 left-0 w-full h-fit flex flex-row justify-between items-start'>
      <div className='flex w-fit h-fit flex-col justify-start items-start pl-4 py-2 cursor-pointer'>
        <div
          onClick={() => router.push('/')}
          className='text-4xl w-fit h-fit text-nowrap flex flex-row gap-1 font-[establishRetrosansOTF] text-white font-bold md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out'
        >
          GOODBYE 2024
        </div>
        <div className='w-fit h-fit -mt-1 flex flex-row gap-1 justify-center items-center text-white '>
          <Icon size={20} icon='logo' />
          <span className='text-lg font-[establishRetrosansOTF] '>해피 뉴이어 2025</span>
        </div>
      </div>
      <div
        onClick={() => setIsInfoOpen(true)}
        className='text-2xl pr-4 py-4 w-fit h-fit text-nowrap flex flex-row gap-1 font-[establishRetrosansOTF] text-white font-bold md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out cursor-pointer'
      >
        <Icon size={36} icon='info' />
      </div>
      <BottomSheet
        height='fit'
        className='flex justify-center items-center gap-6'
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        draggable
      >
        <div className='w-full h-[80vh] overflow-y-scroll flex flex-col justify-start items-center gap-4 pt-1 pb-6 px-6'>
          <div className='w-full h-fit flex flex-col justify-center items-center gap-6'>
            <div className='w-full h-fit flex flex-col justify-center items-center gap-1'>
              <span className='text-3xl font-[establishRetrosansOTF]'>GOODBYE 2024</span>
              <div className='w-fit h-fit flex flex-row gap-1 justify-center items-center text-black '>
                <Icon size={16} icon='logo' />
                <span className='text-md font-[establishRetrosansOTF] '>해피 뉴이어 2025</span>
              </div>
            </div>
            <Image src='/img/preview.png' alt='balloon' objectFit='contain' width={320} height={300} />

            <div className='w-full h-fit text-sm flex flex-col justify-center items-center gap-4 px-4'>
              <span className=' w-full text-left text-md font-pretendard'>
                2024년을 기억하며 2025년 새해 소망을 날려보세요.
              </span>
              <p className='w-full text-left font-pretendard break-keep'>
                2024년을 마무리하고 2025년을 맞이하는 {"'"}아디오스 2024{"'"} 프로젝트를 소개합니다. 우리는 특별한
                순간을 기억하거나 소원을 빌 때면 하늘을 바라보곤 합니다. 그 중에서도 풍선에 소원을 적어 하늘로 띄워
                보내는 것은 오랜 시간 사랑받아온 이벤트입니다. 하지만 이렇게 날려 보낸 풍선들은 결국 환경 오염의 원인이
                되어, 최근에는 많은 환경보호단체에서 해당 행사를 제한하고 있습니다.
              </p>
              <p className='w-full text-left font-pretendard break-keep'>
                {"'"}아디오스 2024{"'"}는 이러한 환경 문제를 해결하면서도 우리의 소원을 담아낼 수 있도록, 실제 풍선 대신
                디지털 공간에서 여러분의 소원을 하늘로 띄우는 프로젝트입니다.
              </p>

              <div
                onClick={() => {
                  router.push('/balloons')
                }}
                className='w-fit h-fit mt-2 text-lg flex flex-row gap-1.5 px-4 py-2 bg-black text-white shadow-md rounded-2xl md:hover:opacity-60 active:opacity-60 active:scale-95 transition-all duration-200 ease-in-out cursor-pointer'
              >
                <Icon icon='logo' className='mr-1' size={20} />
                날아간 풍선 보러가기
              </div>

              <p className='p-4'>
                Copyright © 2025{'  '}
                <a href='https://www.sejinoh.site' target='_blank' rel='noreferrer' className='text-black underline'>
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
