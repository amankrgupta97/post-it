'use client'
import { useCustomToast } from "@/hooks/use-custom-toast"
import{usePrevious} from'@mantine/hooks'
import { CommentVote, VoteType } from "@prisma/client"
import { FC,useState } from "react"
import { ArrowBigDown, ArrowBigUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { CommentVoteRequest } from "@/lib/validators/vote"
import axios, { AxiosError } from "axios"
import { toast } from "./ui/use-toast"
import { Button } from "./ui/button"

interface CommentVotesProps{
    commentId:string
    initalVotesAmt:number,
    initalVote?:PartialVote
}

type PartialVote = Pick<CommentVote, 'type'>

const CommentVotes:FC<CommentVotesProps> = ({
    commentId,
    initalVotesAmt,
    initalVote,
}) => {
    const {loginToast}=useCustomToast()
    const [votesAmt,setVotesAmt]=useState<number>(initalVotesAmt)
    const[currentVote,setCurrentVote]=useState(initalVote)
    const prevVote=usePrevious(currentVote)


    const {mutate:vote}=useMutation({
        mutationFn:async(voteType:VoteType)=>{
            const payload:CommentVoteRequest={
                commentId,
                voteType,
            }
            await axios.patch('/api/subpostit/post/comment/vote',payload)
        },
        onError:(err,voteType)=>{
            if(voteType==='UP') setVotesAmt((prev)=>prev-1)
            else setVotesAmt((prev)=>prev+1)

            //reset currentVote
            setCurrentVote(prevVote)
            if(err instanceof AxiosError){
                if(err.response?.status===401){
                    return loginToast()
                }
            }

            return toast({
                title:'Something went Wrong!',
                description:'Your vote was not registered, please try again later.',
                variant:'destructive'
            })
        },
        onMutate:(type)=>{
            if(currentVote?.type===type){
                setCurrentVote(undefined)
                if(type==='UP') setVotesAmt((prev)=>prev-1)
                else if(type==='Down') setVotesAmt((prev)=>prev+1)
            }else{
                setCurrentVote({type})
                if(type==='UP') setVotesAmt((prev)=>prev+(currentVote?2:1))
                else if(type==='Down')
                setVotesAmt((prev)=>prev-(currentVote?2:1))
            }
        },
    })

  return (
    <div className="flex gap-1">
        <Button size='sm' variant='ghost' aria-label='upote' onClick={()=>vote('UP')}>
            <ArrowBigUp className={cn('h-5 w-5 text-zinc',{
                'text-emerald-500 fill-emerald-500':currentVote?.type==='UP',
            })}/>
        </Button>
        <p className="text-center py-2 font-medium text-sm text-zinc-900">
            {votesAmt}
        </p>
        <Button size='sm' variant='ghost' aria-label='downvote' onClick={()=>vote('Down')}>
            <ArrowBigDown className={cn('h-5 w-5 text-zinc',{
                'text-red-500 fill-red-500':currentVote?.type==='Down',
            })}/>
        </Button>
    </div>
  )
}

export default CommentVotes
