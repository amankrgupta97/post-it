'use client'
import { Button } from './ui/button'
import {useRouter} from 'next/navigation'

export default function CloseModal() {
    const router=useRouter()
  return (
    <Button variant='ghost' className='h-6 w-6 p-0 rounded-md' aria-label='close modal'
    onClick={()=>router.back()}>
        X
    </Button>
  )
}
