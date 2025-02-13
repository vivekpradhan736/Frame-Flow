'use client';

import { useAuthContext } from '@/app/provider';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DesignCard from './_components/DesignCard';
import { RECORD } from '@/app/view-code/[uid]/page';
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebar } from '@/components/ui/sidebar';

function Designs() {
    const { open } = useSidebar();
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [wireframeList, setWireframeList] = useState<RECORD[]>([]); // ✅ Ensure correct type

    useEffect(() => {
        if (user) GetAllUserWireframe();
    }, [user]);

    const GetAllUserWireframe = async () => {
        try {
            const result = await axios.get(`/api/wireframe-to-code?email=${user?.email}`);
            setWireframeList(result.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching wireframes:", error);
        }
    };

    const DeleteCodeToDb = async (uid: string) => {
        try {
            await axios.delete('/api/wireframe-to-code', {
                data: {
                    uid,
                    email: user?.email
                }
            });

            // ✅ Remove deleted item from state (UI updates immediately)
            setWireframeList(prev => prev.filter(item => item.uid !== uid));

            console.log("Deleted Successfully");
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };

    return (
        <div>
            <h2 className="font-bold text-2xl">Wireframe & Codes</h2>

            <div className={`grid grid-cols-1 ${open ? "md:grid-cols-1" : "md:grid-cols-2"} 
                ${open ? "lg:grid-cols-2" : "lg:grid-cols-3"} 
                ${open ? "xl:grid-cols-3" : "xl:grid-cols-4"} gap-7 mt-10`}
            >
                {loading && (
                    <>
                        <Skeleton className="h-[225px] w-full rounded-lg" />
                        <Skeleton className="h-[225px] w-full rounded-lg" />
                        <Skeleton className="h-[225px] w-full rounded-lg" />
                        <Skeleton className="h-[225px] w-full rounded-lg" />
                        <Skeleton className="h-[225px] w-full rounded-lg" />
                        <Skeleton className="h-[225px] w-full rounded-lg" />
                    </>
                )}
                
                {!loading && wireframeList.map((item) => (
                    <DesignCard key={item.uid} item={item} user={user} DeleteCodeToDb={DeleteCodeToDb} />
                ))}
            </div>
        </div>
    );
}

export default Designs;
