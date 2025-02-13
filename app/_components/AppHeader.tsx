import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import ProfileAvatar from './ProfileAvatar'
import Image from 'next/image'
import { useRouter } from 'next/navigation';

function AppHeader({ hideSidebar = false }) {
    const router = useRouter();
    return (
        <div className='px-4 py-2 shadow-sm flex items-center justify-between w-full '>
            {!hideSidebar ? <SidebarTrigger /> :
                <div className='flex items-center cursor-pointer' onClick={() => router.push("/")}>
                    <Image src={'/logo.svg'} alt='logo' width={100} height={100}
                        className='w-[40px] h-[40px]' />
                    <div className='flex flex-col items-start'>
                        <h2 className='font-bold text-xl'>FrameFlow</h2>
                        <h2 className='text-xs text-gray-400 text-center'>Build Awesome</h2>
                    </div>
                </div>
            }
            <ProfileAvatar />
        </div>
    )
}

export default AppHeader