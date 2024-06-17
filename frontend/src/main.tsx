import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Login, Signup, Home } from './pages/index.ts'
import { Provider } from 'react-redux'
import store from './store/store.ts'
import { ThemeProvider } from './components/theme-provider.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      }
    ]
  },
  {
    path: '/login',
    element: 
      <ThemeProvider>
        <Login />
      </ThemeProvider>
  },
  {
    path: '/signup',
    element: 
      <ThemeProvider>
        <Signup />
      </ThemeProvider>
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
