import { Menu, Home, SquarePlay, History, ThumbsUp, ListVideo } from "lucide-react"
import { Button } from "../ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter} from "../ui/sheet"
import {useNavigate} from "react-router-dom"

const options = [
    {
        icon: Home,
        title: 'Home',
        path: '/'
    },
    {
        icon: SquarePlay,
        title: 'Your videos',
        path: '/my-videos'
    },
    {
        icon: History,
        title: 'History',
        path: '/history'
    },
    {
        icon: ThumbsUp,
        title: 'Liked Videos',
        path: '/liked-videos'
    },
    {
        icon: ListVideo,
        title: 'Playlists',
        path: '/playlists'
    }
]

export const Hamburger = () => {
    const navigate = useNavigate();

  return (
    <Sheet>
    <SheetTrigger className='md:mr-4 sm:mr-2' asChild>
        <Button variant="outline" size="icon" className='inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 px-0 text-base bg-transparent hover:bg-secondary/60 focus-visible:ring-0 focus-visible:ring-offset-0 border-0'>
            <Menu className="h-[1.2rem] w-[1.2rem] sm:h-[1.28rem] sm:w-[1.28rem] md:h-[1.35rem] md:w-[1.35rem] "></Menu>
            <span className="sr-only">Toggle Menu</span>
        </Button>
    </SheetTrigger>
    <SheetContent className='w-[270px]' side={'left'}>
      <SheetHeader className='border-b border-border/90 pb-2 sm:text-center'>
        <SheetTitle className='text-base'>Options</SheetTitle>
      </SheetHeader>
      <SheetFooter className="pt-4 flex flex-col sm:flex-col sm:space-x-0">
        {options.map((_,index) => {
            const { icon: Icon, title, path} = options[index];
            return(
                <Button key={index} onClick={() => navigate(path)} className='mb-2 ps-3 flex justify-start gap-5 bg-background hover:bg-zinc-100 text-zinc-700 dark:hover:bg-[#272727] dark:text-white'>
                    <Icon className="h-[1.2rem] w-[1.2rem]" /> {title}
                </Button>
            )
        })}
      </SheetFooter>
    </SheetContent>
  </Sheet>
  )
}
