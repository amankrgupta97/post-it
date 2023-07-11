import { getAuthSession } from '@/app/api/auth/[...nextauth]/route'
import { MiniCreatePost } from '@/components/MiniCreatePost'
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import React, { FC } from 'react'

interface pageProps{
params:{
    slug:string
}
}
const page = async ({params}:pageProps) => {
    const {slug}=params
    const session=await getAuthSession()
    const subpostit =await db.subpostit.findFirst({
        where:{name:slug},
        include:{
            posts:{
                include:{
                    author:true,
                    votes:true,
                    comments:true,
                    subpostit:true,
                },
                take:INFINITE_SCROLLING_PAGINATION_RESULTS
            }
        }
    })
    if(!subpostit)return notFound()
  return (
    <>
    <h1 className='font-bold text-3xl md:text-4xl h-14'>r/{subpostit.name}</h1>
    <MiniCreatePost session={session}/>
    </>
  )
}

export default page