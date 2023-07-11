import { TypeReference } from 'typescript'
import {z} from 'zod'

export const SubpostitValidator=z.object({
    name:z.string().min(3).max(21)
})

export const SubpostitSubscriptionValidator=z.object({
    subpostitId:z.string()
})

export type CreateSubpostitPayload=z.infer<typeof SubpostitValidator>
export type SubscribeToSubpostitPayload=z.infer<typeof SubpostitSubscriptionValidator>