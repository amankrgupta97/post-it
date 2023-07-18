import { db } from "@/lib/db";
import { z } from 'zod'
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { PostValidator } from "@/lib/validators/post";

export async function POST(req:Request){
    try {
        const session= await getAuthSession()
        if(!session?.user){
            return new Response('Unauthorized',{status:401})

        }
        const body=await req.json()
        const {subpostitId,title,content}=PostValidator.parse(body)
        const subscription=await db.subscription.findFirst({
            where:{
                subpostitId,
                userId:session.user.id
            }
        })
        if(!subscription){
            return new Response('Subscribe to Post',{
                status:403
            })
        }
        await db.post.create({
            data:{
                title,
                content,
                authorId:session.user.id,
                subpostitId,
            }
        })
        return new Response('OK')
    } catch (error) {

        if(error instanceof z.ZodError){
            return new Response('Invalid data passed',{status:422})
        }
        return new Response('Could not Post, please try again later',{status:500})
        
    }
}