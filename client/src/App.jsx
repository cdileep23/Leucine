import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Body from './components/custom/Body'
import Home from './pages/Home'
import Auth from "./pages/Auth";
import { Toaster } from 'sonner';
const App = () => {
  const app = createBrowserRouter([
    {
      path: "/",
      element: <Body />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path:'/auth',
          element:<Auth/>
        }
      ],
    },
  ]);
  return (
    <main>
      <Toaster position='bottom-right'/>
      <RouterProvider router={app}/>
    </main>
  )
}

export default App