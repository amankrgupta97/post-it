import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export const useCustomToast=()=>{
    const loginToast=()=>{
        const {dismiss}=toast({
            title:'Login Required',
            description:'You need to be logged in to perform that action',
            variant:'destructive',
            action:(
                <Link href='/sign-in' onClick={()=>dismiss()} className={buttonVariants({variant:'outline'})}>
                    Login
                </Link>
            )
        })
    }
    return {loginToast}
}