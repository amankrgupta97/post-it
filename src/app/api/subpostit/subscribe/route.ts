import { SubpostitSubscriptionValidator } from "@/lib/validators/subpostit";
import { getAuthSession } from "../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { z } from 'zod'

export async function POST(req:Request){
    try {
        const session= await getAuthSession()
        if(!session?.user){
            return new Response('Unauthorized',{status:401})

        }
        const body=await req.json()
        const {subpostitId}=SubpostitSubscriptionValidator.parse(body)
        const subscriptionExist=await db.subscription.findFirst({
            where:{
                subpostitId,
                userId:session.user.id
            }
        })
        if(subscriptionExist){
            return new Response('You are already subscribed to this subpostit',{
                status:400,
            })
        }
        await db.subscription.create({
            data:{
                subpostitId,
                userId:session.user.id
            }
        })
        return new Response(subpostitId)
    } catch (error) {

        if(error instanceof z.ZodError){
            return new Response('Invalid data passed',{status:422})
        }
        return new Response('Could not subscribe, please try again later',{status:500})
        
    }
}