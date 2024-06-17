/* eslint-disable react-hooks/exhaustive-deps */
import  { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { Input } from "../ui/input"
import { ModeToggle } from "../mode-toggle"
import { AvatarComp } from "./AvatarComp"
import { Hamburger } from "./Hamburger"
import { Link,useNavigate } from "react-router-dom"
import { User } from "lucide-react"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { getInitials } from "@/utils/helper"
import { fetchVideos } from '@/store/Actions/contentActions';


export const Header = ({
    height = "",
    className = ""
}) => {
    const dispatch = useDispatch()
    const [query, setQuery] = useState('');
    const navigate = useNavigate()
    const {isLoggedIn, user} = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        dispatch(fetchVideos(query))
    }, [query])

    const handleClick = () => {
        navigate("/login")
    }

    // Debounce the passed `onSearch` function
    const debouncedSearch = useCallback(
        debounce((nextValue) => setQuery(nextValue), 1000),
        [] // will be created only once initially
    );

    const handleChange = (e: { target: { value: string; }; }) => {
        const nextValue = e.target.value;
        setQuery(nextValue);
        debouncedSearch(nextValue);
    };

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${height} ${className}`}>
        <div className='container flex h-14 md:h-20 max-w-screen-2xl px-3 md:px-5 items-center'>
            <Hamburger/>
            <Link to={"/"} className='text-sm mr-2 ml-1 font-semibold text-violet-700 dark:text-violet-400 md:text-lg sm:text-base lg:text-xl'>Europa</Link>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <div className='w-full flex-1 md:w-auto md:flex-none relative'>
                <Input placeholder="Search..." className="h-[2rem] sm:h-[2.2rem] min-[450px]:w-[230px] ring-offset-transparent focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 md:w-[27rem] lg:w-[31rem] min-[450px]:fixed min-[450px]:top-[0.7rem] min-[450px]:right-[6.5rem] sm:right-[7rem] md:top-[1.6rem] lg:right-[30%] xl:right-[34%] dark:border-white/75"
                value={query}
                onChange={handleChange}
                ></Input>
                </div>
                <nav className="flex gap-1 items-center">
                    <ModeToggle />
                    
                    {!isLoggedIn ? <Button variant="outline" size="icon" className='inline-flex items-center justify-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground py-2 px-0 text-base bg-transparent hover:bg-secondary/60 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full active:scale-75 transition-all duration-300 hover:bg-zinc-100 text-zinc-700 dark:hover:bg-[#272727] dark:text-white w-[40px] lg:w-[100px] h-[40px]'
                    onClick={handleClick}
                    >
                        <User className="h-[1rem] w-[1rem] sm:h-[1.1rem] sm:w-[1.1rem] md:h-[1.2rem] md:w-[1.2rem]"></User>
                        <span className="hidden text-sm lg:inline-block ml-2">Log In</span>
                    </Button>
                    : 
                    <AvatarComp src={user.avatar} alt={user.username} fallback={getInitials(user.fullName)} className="h-6 w-6 sm:h-7 sm:w-7 cursor-pointer"></AvatarComp>
                    }
                </nav>
            </div>
        
        </div>
    </header>
  )
}
