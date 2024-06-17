import { VideoCard } from "@/components"
import { RootState } from "@/store/store"
import { formatDuration, timeSince } from "@/utils/helper"
import { useSelector } from "react-redux"
import { Skeleton } from "@/components/ui/skeleton"

type Owner = {
    _id: string,
    fullName: string,
    avatar: string
}

type Videos = {
    _id: string,
    title: string,
    thumbnail: string,
    duration: number,
    views: string,
    owner: Array<Owner>,
    createdAt: string,
    onClickFunction: (event: Event) => void
}

const onClick = (videoId: string) => {
    // Handle the click event here
    console.log(`Clicked video with ID: ${videoId}`);
};

export const Home = () => {
    const { data, loading, error } = useSelector((state: RootState) => state.content)
    const { isLoggedIn } = useSelector((state: RootState) => state.auth)
    const skeletons = Array(data?.meta.count).fill(null) || Array(8).fill(null)

    if (data === null) {
        return (
          isLoggedIn ? (
            <>
              <div className="absolute w-64 top-[40%] left-[50%] -translate-x-2/4 -translate-y-2/4 text-center">
                <img src="/cute-blue-T.Rex.png" alt="A cute T Rex" className="w-full" />
                <h2 className="text-xl tracking-wider mb-2 text-teal-600 dark:text-rose-400 font-semibold">No Videos for you</h2>
                <p className="tracking-wide">Looks like there are no uploads on Europa yet</p>
              </div>
            </>
          )
          : (
            <>
              <div className="absolute w-64 top-[40%] left-[50%] -translate-x-2/4 -translate-y-2/4 text-center">
                <img src="/cute-astronaut.png" alt="A cute astronaut" className="w-full" />
                <h2 className="text-xl tracking-wider mb-2 text-teal-600 dark:text-rose-400 font-semibold">Login to access videos.</h2>
                <p className="tracking-wide">{error || "This ain't a charity, get logged in."}</p>
              </div>
            </>
          ) 
        )
    }
    
    return (
        loading ? (
          skeletons?.map((_, index) => (
            <div key={index} className="flex flex-col space-y-3 w-full min-h-[16rem] max-w-[400px] md:w-full my-8 sm:my-4">
              <Skeleton className="h-[208px] w-full rounded-xl" />
              <div className="space-y-2 h-[95.2px] flex flex-col pb-8">
                <Skeleton className="flex-1" />
                <Skeleton className="flex-1" />
              </div>
            </div>
          ))
        ) 
        : 
          data.data?.map((video: Videos) => (
            <VideoCard
                   key={video._id}
                   className='min-h-[16rem] w-full max-w-[400px] md:w-full my-8 sm:my-4'
                   title={video.title}
                   thumbnail={video.thumbnail}
                   channelAvatar={video.owner.avatar}
                   channelName={video.owner.fullName}
                   views={video.views}
                   postedOn={timeSince(video.createdAt) + " ago"}
                   duration={formatDuration(video.duration)}
                   onClickFunction={() => onClick(video._id)}
               />
          ))
        
    )
}