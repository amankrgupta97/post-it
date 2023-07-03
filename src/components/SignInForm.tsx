'use client'
import { cn } from '@/lib/utils'
import React, { FC, useState } from 'react'
import { Button } from './ui/button'
import {signIn} from 'next-auth/react'
import { Icons } from './Icons'
import { useToast } from './ui/use-toast'

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement>{}

 const SignInForm:FC<SignInFormProps>=({className,...props})=>
  {
    const[isLoading,setIsLoading]=useState(false)
    const {toast} =useToast();
    const loginWithGoogle=async ()=>{
        setIsLoading(true)
        try{
            await signIn('google')
        }catch(error){
            //toast notification
            toast({
                title:'There was some problem',
                description:"Some Error occured while logging with google",
                variant:'destructive'
            })
        }finally{
            setIsLoading(false)
        }
    }
  return (
    <div className={cn('flex justify-center',className)}{...props}>
        <Button onClick={loginWithGoogle} isLoading={isLoading} size='sm' className='w-full'>{isLoading?null:<Icons.google className='h-4 2-4 mr-2'/>}Google</Button>
    </div>
  )
}

export default SignInForm;