import { Comment, Subpostit, User, Vote } from "@prisma/client"

export type ExtendedPost=Post&{
    subpostit:Subpostit,
    votes:Vote[],
    auhtor:User,
    comments:Comment[]
}