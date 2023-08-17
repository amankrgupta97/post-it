'use client'
import { Prisma, Subpostit } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useCallback, useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react"
import debounce from 'lodash.debounce'

const SearchBar = () => {
  const [input, setInput] = useState<string>('')


  const { data: queryResults, refetch, isFetched, isFetching } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as (Subpostit & {
        _count: Prisma.SubpostitCountOutputType
      })[]
    },
    queryKey: ['search-query'],
    enabled: false,
  })
  const debounceRequest = useCallback(() => {
    request()
  }, [])
const request=debounce(()=>{
  refetch()
},500)
  const router = useRouter()
  return (
    <Command className="relative rounded-lg border max-w-lg z-50 overflow-visible">
      <CommandInput className="outline-none border-none focus:border-none focus:outline-none ring-0" placeholder="Search communities..."
        value={input} onValueChange={(text) =>
           {setInput(text) 
          debounceRequest()}} />
      {input.length > 0 ? (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading='Communities'>{queryResults?.map((subpostit) => (
              <CommandItem onSelect={(e) => {
                router.push(`/r/${e}`)
                router.refresh()
              }} key={subpostit.id} value={subpostit.name}><Users className="mr-2 h-4 w-4" />
                <a href={`/r/${subpostit.name}`}>r/{subpostit.name}</a></CommandItem>
            ))}</CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  )
}

export default SearchBar
