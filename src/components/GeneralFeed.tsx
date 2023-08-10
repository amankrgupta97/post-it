import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import PostFeed from "./PostFeed"

const GeneralFeed = async () => {
const posts=await db.post.findMany({
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

export default GeneralFeed