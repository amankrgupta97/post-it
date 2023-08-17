import Link from 'next/link'
import React from 'react'
import { Icons } from './Icons'
import { buttonVariants } from './ui/button'
import { getAuthSession } from '@/app/api/auth/[...nextauth]/route'
import UserAccount from './UserAccount'
import SearchBar from './SearchBar'

export default async function Navbar() {
  const session=await getAuthSession()
  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-zinc-300 z-10 py-2 '>
        <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
            <Link href='/' className='flex gap-2 items-centers' >
                <Icons.logo className='h-8 w-8 sm:h-6 sm:w-6'/>
                <p className='hidden text-zinc-700 text-sm font-medium md:block'>PostIt</p>
            </Link>
            <SearchBar/>
            {session?.user ?(
              <UserAccount user={session.user}/>
              ):
              <Link href='/sign-in' className={buttonVariants()}>Sign In</Link>
              }
        </div>
    </div>
  )
}
