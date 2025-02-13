"use client"
import { useAuthContext } from '@/app/provider'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DesignCard from './_components/DesignCard';
import { RECORD } from '@/app/view-code/[uid]/page';
import { Skeleton } from "@/components/ui/skeleton"

function Designs() {

    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [wireframeList, setWireframeList] = useState([]);
    useEffect(() => {
        user && GetAllUserWireframe();
    }, [user])

    const GetAllUserWireframe = async () => {
        // setLoading(true)
        const result = await axios.get('/api/wireframe-to-code?email='
            + user?.email);
            setWireframeList(result.data);
            setLoading(false)
    }

    return (
        <div>
            <h2 className='font-bold text-2xl'>Wireframe & Codes</h2>

            <div className='grid grid-cols-2 lg:grid-cols-3 gap-7 mt-10'>
                {loading === true && (
                    <>
                      <Skeleton className="h-[225px] w-full rounded-lg" />
                      <Skeleton className="h-[225px] w-full rounded-lg" />
                      <Skeleton className="h-[225px] w-full rounded-lg" />
                      <Skeleton className="h-[225px] w-full rounded-lg" />
                      <Skeleton className="h-[225px] w-full rounded-lg" />
                      <Skeleton className="h-[225px] w-full rounded-lg" />
                    </>
                )}
                {loading === false && wireframeList?.map((item: RECORD, index) => (
                        <DesignCard key={index} item={item} />
                ))}
            </div>
        </div>
    )
}

export default Designs