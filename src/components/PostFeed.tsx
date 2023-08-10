"use client"
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FC, useEffect, useRef } from "react";
import Post from "./Post";

interface PostFeedProps {
  initalPost: ExtendedPost[]
  subpostitName?: string
}
const PostFeed: FC<PostFeedProps> = ({ initalPost, subpostitName }) => {
  const lastPostRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1
  })
  const { data: session } = useSession()
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infinite-query'],
    async ({ pageParam = 1 }) => {
      const query = `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subpostitName ? `&subpostitName=${subpostitName}` : '')
      const { data } = await axios.get(query)
      return data as ExtendedPost[]
    }, {
    getNextPageParam: (_, pages) => {
      return pages.length + 1
    },
    initialData: { pages: [initalPost], pageParams: [1] },
  }
  )
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage])
  const posts = data?.pages.flatMap((page) => page) ?? initalPost
  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc: any, vote: any) => {
          if (vote.type == 'UP') return acc + 1
          if (vote.type == 'DOWN') return acc - 1
          return acc
        }, 0)
        const currentVote = post.votes.find((vote: any) => vote.userId === session)
        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post currentVote={currentVote} votesAmt={votesAmt} commentAmt={post.comments.length} post={post} subpostitName={post.subpostit.name} />
            </li>
          )
        } else {
          return <Post currentVote={currentVote} votesAmt={votesAmt} commentAmt={post.comments.length} post={post} subpostitName={post.subpostit.name} key={post.id} />
        }
      })}
    </ul>
  )
}

export default PostFeed;
