import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { LogOut, UserSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "@/utils/api"
import { useDispatch } from "react-redux"
import { logout } from "@/store/Slices/authSlice"
import { contentReset } from "@/store/Slices/contentSlice"
import { useToast } from "../ui/use-toast"

export const AvatarComp = ({
  src = "",
  alt = "",
  fallback = "",
  className = ""
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {toast} = useToast()

  const handleLogout = async () => {
    try{
      const response = await api.post('/users/logout', JSON.stringify({}), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(response.data.message)
      dispatch(logout())
      dispatch(contentReset())
      toast({
        title: "Logged out",
        description: response.data.message + " successfully!",
      })
    }catch(err){
      console.error("ERROR: ",err)
    }
  }

  return  (
    <DropdownMenu>
      <DropdownMenuTrigger className="ring-offset-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 rounded-full border-0">
        <Avatar className={`${className} active:scale-75 transition-all duration-300`}>
          <AvatarImage src={src} alt={alt} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-44 md:mr-4 md:mt-3 sm:w-56'>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() =>navigate('/profile')}>
            <UserSquare className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⊞Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    
  )
}
