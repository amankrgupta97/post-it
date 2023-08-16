import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

interface CommentSectionProps {
    postId: string;
}

const CommentSection = async ({ postId }: CommentSectionProps) => {

    const session = await getAuthSession()
    const comments = await db.comment.findMany({
        where: {
            postId,
            replyToId: null,
        },
        include: {
            author: true,
            votes: true,
            replies: {
                include: {
                    author: true,
                    votes: true,
                }
            }
        }
    })
    return (
        <div className="flex flex-col gap-y-4 mt-4">
            <hr className="w-full h-px my-6" />
            <CreateComment postId={postId} />
            <div className="flex flex-col gap-y mt-4">
                {comments
                    .filter((comment) => !comment.replyToId)
                    .map((topLevelComment) => {
                        const topLevelCommentVotesAmt = topLevelComment.votes.reduce((acc, vote) => {
                            if (vote.type === 'UP') return acc + 1
                            if (vote.type === 'Down') return acc - 1
                            return acc
                        }, 0)
                        const topLevelCommentVote = topLevelComment.votes.find((vote) => vote.userId === session?.user.id)

                        return <div key={topLevelComment.id} className="flex flex-col">
                            <div className="mb-2">
                                <PostComment postId={postId} currentVote={topLevelCommentVote} votesAmt={topLevelCommentVotesAmt} comment={topLevelComment} />
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default CommentSection;