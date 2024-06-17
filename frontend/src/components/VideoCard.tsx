import { EllipsisVertical } from "lucide-react"


import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { getInitials } from "@/utils/helper"

export const VideoCard = ({
  title,
  thumbnail,
  duration,
  views,
  channelName,
  channelAvatar,
  postedOn,
  onClickFunction,
  className
}:Readonly<{
  title: string,
  thumbnail: string,
  duration: string,
  views: string,
  channelName: string,
  channelAvatar: string,
  postedOn: string | undefined,
  onClickFunction: () => void,
  className:string
}>) => {
  return (
    <Card className={`border-none dark:bg-transparent rounded-[0.8rem] overflow-hidden ${className}`}
    onClick={onClickFunction}
    >
      <CardContent className="w-full h-[13rem] p-0 mb-2 relative">
        <img
          src={thumbnail}
          alt=""
          className="w-full h-full object-fill rounded-b-[0.8rem]"
        />
        <span className="absolute bg-black/60 text-xs px-1 rounded-sm font-semibold bottom-1.5 right-3 text-white py-0.5">{duration}</span>
      </CardContent>
      <CardFooter className="flex items-start justify-between p-2">
        <div className="flex gap-3.5 items-start mb-5">
        <Avatar className={`active:scale-75 transition-all duration-300`}>
          <AvatarImage src={channelAvatar} alt={channelName} className=' object-fill'/>
          <AvatarFallback>{getInitials(channelName)}</AvatarFallback>
        </Avatar>
          {/* <img src={channelAvatar} alt="" className='rounded-full h-[2.66rem] w-11' /> */}
          <div>
            <h3 className="text-base leading-[1.2rem] overflow-hidden overflow-ellipsis line-clamp-2 font-semibold text-gray-700 dark:text-white w-[90%] m-0">
              {title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-gray-300">{channelName}</p>
            <p className="text-sm text-slate-500 dark:text-gray-300"><span>{views} views</span> <span className='before:content-["•"] before:px-1'>{postedOn}</span></p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical size={18} className="cursor-pointer active:scale-75" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              Options
            </DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <span>option 1</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>option 2</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>option 3</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
