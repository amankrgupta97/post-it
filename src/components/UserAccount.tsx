'use client'
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { User } from "next-auth"
import { FC } from "react"
import UserAvatar from "./UserAvatar"

interface UserAccountProps{
user:Pick<User,'name'|'image'|'email'>
}
const UserAccount:FC<UserAccountProps>=({user})=> {
  return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar user={{
                    name:user.name || null,
                    image:user.image||null,
                }}/>
            </DropdownMenuTrigger>
        </DropdownMenu>
  )
}

export default UserAccount;
