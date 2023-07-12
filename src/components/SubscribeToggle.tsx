'use client'
import { useMutation } from '@tanstack/react-query'
import { Button } from './ui/button'
import { SubscribeToSubpostitPayload } from '@/lib/validators/subpostit'
import { FC, startTransition } from 'react'
import axios, { AxiosError } from 'axios'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from './ui/use-toast'
import { useRouter } from 'next/navigation'

interface SubscribeToggleProp{
    subpostitId:string
    subpostitName:string
    isSubscribed:boolean
}

export const SubscribeToggle:FC<SubscribeToggleProp> = ({subpostitId,subpostitName,isSubscribed}) => {
    const {loginToast}=useCustomToast()
    const router =useRouter()
    const {mutate:subscribe,isLoading:isSubLoading}=useMutation({
        mutationFn:async()=>{
            const payload:SubscribeToSubpostitPayload={
                subpostitId,
            }
            const {data}=await axios.post('/api/subpostit/subscribe',payload)
            return data as string
        },
        onError:(err)=>{
            if(err instanceof AxiosError){
                if(err.response?.status===401){
                    return loginToast()
                }
            }
            return toast({
                title:"There was some problem",
                description:"Something went wrong, please try again.",
                variant:"destructive"
            })
        },
        onSuccess:()=>{
            startTransition(()=>{
                router.refresh()
            })
            return toast({
                title:'Subscribed',
                description:`You are now Subscribed to r/${subpostitName}`,
                variant:'destructive'
            })
        }
    })

    const {mutate:unsubscribe,isLoading:isUnSubLoading}=useMutation({
        mutationFn:async()=>{
            const payload:SubscribeToSubpostitPayload={
                subpostitId,
            }
            const {data}=await axios.post('/api/subpostit/unsubscribe',payload)
            return data as string
        },
        onError:(err)=>{
            if(err instanceof AxiosError){
                if(err.response?.status===401){
                    return loginToast()
                }
            }
            return toast({
                title:"There was some problem",
                description:"Something went wrong, please try again.",
                variant:"destructive"
            })
        },
        onSuccess:()=>{
            startTransition(()=>{
                router.refresh()
            })
            return toast({
                title:'UnSubscribed',
                description:`You have UnSubscribed to r/${subpostitName}`,
                variant:'destructive'
            })
        }
    })
  return isSubscribed ? (
    <Button className='w-full mt-1 mb-4' onClick={()=>unsubscribe()} isLoading={isUnSubLoading}>Leave community</Button>
  ):
  (
    <Button className='w-full mt-1 mb-4' onClick={()=>subscribe()} isLoading={isSubLoading}>Join to Post</Button>
  )
}
