import React, { useState } from 'react'
import { RECORD } from '../[uid]/page'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowRight, Maximize, PanelLeftOpen } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Drawer } from 'vaul';
import { AppSidebar } from '@/app/_components/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

function SelectionDetail({ record, regenrateCode, newGenerateCode, isReady }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState(record?.description);
    return record && (
        <div className='px-5 pt-2 pb-1 bg-gray-100 rounded-lg'>
            <h2 className='font-bold my-2'>Wireframe</h2>
            <div className="relative w-full h-[200px] border border-dashed p-2 bg-white rounded-lg group transition duration-500 ease-in-out">
          <Image
            src={record?.imageUrl}
            alt="Wireframe"
            width={800}
            height={800}
            className="rounded-lg object-contain w-full h-full group-hover:opacity-80 group-hover:blur-[2px] transition duration-300 ease-in-out"
          />

          <Dialog>
      <DialogTrigger asChild>
      <div className="absolute cursor-pointer hidden group-hover:block  transition duration-500 ease-in-out bottom-2 right-2  rounded-full shadow-md ">
          <Maximize className="object-contain" />
          </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <div className="grid gap-4 py-4">
          <Image
            src={record?.imageUrl}
            alt="Wireframe"
            width={800}
            height={800}
            className="rounded-lg object-contain w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
        </div>

            <h2 className='font-bold mt-4 mb-2'>AI Model</h2>
            <Input defaultValue={record?.model} disabled={true} className='bg-white' />

            <h2 className='font-bold mt-3 mb-2'>Prompt</h2>
            <Textarea defaultValue={record?.description} placeholder='Enter your prompt'
                className='bg-white h-[160px]' onChange={(e) => setNewPrompt(e.target.value)} />
            
            <Button className='mt-4 w-full' disabled={newPrompt === ""} onClick={() => newGenerateCode(newPrompt)} > <ArrowRight /> Send</Button>

            <Drawer.Root  direction="left" open={isOpen} onOpenChange={setIsOpen}>
            <Drawer.Trigger className="relative flex h-8 flex-shrink-0 items-center justify-center">
            <PanelLeftOpen />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />

        {/* ✅ Let Vaul handle animations using "data-state" */}
        <Drawer.Content
          className="fixed left-0 top-0 bottom-0 z-10 w-[250px] flex bg-zinc-50 shadow-lg transition-transform duration-300 ease-in-out data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full"
        >
          <div className="h-full w-full grow p-5 flex flex-col rounded-r-[16px]">
            <div className="max-w-md mx-auto">
            <SidebarProvider>
              <AppSidebar />
            </SidebarProvider>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
        </div>
    )
}

export default SelectionDetail