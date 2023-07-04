'use client'
import { User } from "next-auth"
import { FC } from "react"
import UserAvatar from "./UserAvatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Link from "next/link"
import { signOut } from "next-auth/react"

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
            <DropdownMenuContent className="bg-white" align="end">
                <div className="flex items-center justify-center gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-medium">{user.name}</p>}
                        {user.email && <p className="w-[200px] truncate text-sm text-zinc-700">{user.email}</p>}
                    </div>
                </div>

                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild>
                    <Link href='/'>Feed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href='/r/create'>Create communtiy</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href='/settings'>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onSelect={()=>signOut()} className="cursor-pointer">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
  )
}

export default UserAccount;
