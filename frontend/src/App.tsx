import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "./components/Header/Header"
import { Outlet } from "react-router-dom"
import { Toaster } from "./components/ui/toaster"

function App() {
  

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div
      className='relative min-h-screen overflow-y-scroll bg-background flex flex-col'
      >
        <Header></Header>
        <div className="flex-1 border-b">
          <div className="container h-[90svh] px-1 md:px-4 flex-1 items-start grid place-items-center sm:grid-cols-2 gap-2 md:grid-cols-[repeat(2,_minmax(367px,_1fr))] md:gap-4 lg:grid-cols-[repeat(3,_minmax(317px,_1fr))] lg:gap-4 min-[1375px]:grid-cols-[repeat(4,_minmax(317px,_1fr))] min-[1375px]:gap-8 relative">
          <Outlet></Outlet>
        </div>
        </div>
      </div>
      <Toaster/>
    </ThemeProvider>
  )
}

export default App
