import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import PostFeed from "./PostFeed"
import { getAuthSession } from "@/app/api/auth/[...nextauth]/route"

const CustomFeed = async () => {

    const session=await getAuthSession()
    const followedCommunities=await db.subscription.findMany({
        where:{
            userId:session?.user.id
        },
        include:{
            subpostit:true,
        }
    })

    const posts=await db.post.findMany({
        where:{
            subpostit:{
                name:{
                    in:followedCommunities.map(({subpostit})=>subpostit.id)
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        },
        include:{
            votes:true,
            author:true,
            comments:true,
            subpostit:true,
        },
        take:INFINITE_SCROLLING_PAGINATION_RESULTS,
    })
  return (
    <PostFeed initalPost={posts}/>
  )
}

export default CustomFeed