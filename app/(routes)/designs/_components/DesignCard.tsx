import { Button } from '@/components/ui/button';
import Constants from '@/data/Constants';
import { Code, EllipsisVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

function DesignCard({ item, user, DeleteCodeToDb }: any) {
    const modelObj = item && Constants.AiModelList.find(x => x.name === item?.model);

    return (
        <div className="relative p-5 border rounded-lg">
            <Image src={item?.imageUrl} alt="image"
                width={300} height={200}
                className="w-full h-[200px] object-cover bg-white rounded-lg"
            />

            <div className="mt-2">
                <h2 className="line-clamp-3 text-gray-400 text-sm">{item?.description}</h2>
                

                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-full">
                        {modelObj && <Image src={modelObj?.icon} alt={modelObj?.modelName ?? ''} width={30} height={30} />}
                        <h2>{modelObj?.name}</h2>
                    </div>
                    <Link href={'/view-code/' + item?.uid}>
                        <Button> <Code /> View Code</Button>
                    </Link>
                </div>
            </div>

            <Popover>
      <PopoverTrigger asChild>
      <button className="absolute cursor-pointer top-2 right-0">
            <EllipsisVertical className='w-5 h-5' />
                </button>
      </PopoverTrigger>
      <PopoverContent className="w-32">
        <div className="grid gap-4">
          <div className="space-y-2">
            <div onClick={() => DeleteCodeToDb(item.uid)}  className='flex items-center justify-start gap-1 cursor-pointer hover:bg-[#f5f5f5]'>
            <Trash2 className='w-[1.1rem] h-[1.1rem]'/>
            <h2 className="">
                Delete
            </h2>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>

        </div>
    );
}

export default DesignCard;
