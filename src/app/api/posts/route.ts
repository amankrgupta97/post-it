import { db } from "@/lib/db"
import { getAuthSession } from "../auth/[...nextauth]/route"
import {z} from 'zod'
export async function GET(req:Request) {
    const url=new URL(req.url)
    const session=await getAuthSession()
    let followedCommunitiesIds:string[]=[]
    if(session){
        const followedCommunities=await db.subscription.findMany({
            where:{
                userId:session.user.id,
            },
            include:{
                subpostit:true
            }
        })

        followedCommunitiesIds=followedCommunities.map(({subpostit})=>subpostit.id)
    }
    try {
        const {limit,page,subpostitName}=z.object({
            limit:z.string(),
            page:z.string(),
            subpostitName:z.string().nullish().optional(),
        }).parse({
            subpostitName:url.searchParams.get('subpostitName'),
            limit:url.searchParams.get('limit'),
            page:url.searchParams.get('page'),
        })

        let whereClause={}

        if(subpostitName){
            whereClause={
                subpostit:{
                    name:subpostitName,
                },
            }
        }else if(session){
            whereClause={
                subpostit:{
                    id:{
                        in:followedCommunitiesIds
                    }
                }
            }
        }

        const posts =await db.post.findMany({
            take:parseInt(limit),
            skip:(parseInt(page)-1)*parseInt(limit),
            orderBy:{
                createdAt:'desc',
            },
            include:{
                subpostit:true,
                votes:true,
                author:true,
                comments:true,
            },
            where:whereClause,
        })
        return new Response(JSON.stringify(posts))
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 })
        }
        return new Response('Could not fetch more posts', { status: 500 })
    }
}