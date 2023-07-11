import { SubpostitValidator } from "@/lib/validators/subpostit";
import { getAuthSession } from "../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { z } from 'zod'

export async function POST(req:Request) {
    try{
        const session= await getAuthSession()

        if(!session?.user){
            return new Response('Unauthourized', {status:401})
        }
        const body=await req.json()
        const {name}=SubpostitValidator.parse(body)
        const subpostitExists=await db.subpostit.findFirst({
            where:{
                name
            }
        })
        if(subpostitExists){
            return new Response('Subpostit already exist',{status:409})
        }
        const subpostit=await db.subpostit.create({
            data:{
                name,
                creatorId:session.user.id
            }
        })

        await db.subscription.create({
            data:{
                userId:session.user.id,
                subpostitId:subpostit.id,
            }
        })

        return new Response(subpostit.name)
    }catch(error){
        if(error instanceof z.ZodError){
            return new Response(error.message,{status:422})
        }
        return new Response('Could not create subpostit',{status:500})
    }
}