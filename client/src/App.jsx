import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Body from './components/custom/Body'
import Home from './pages/Home'
import Auth from "./pages/Auth";
import { Toaster } from 'sonner';
import RequestAccess from './pages/RequestAccess';
import PendingRequest from './pages/PendingRequest';
import CreateSoftware from './pages/CreateSoftware';
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
          path: "/auth",
          element: <Auth />,
        },
        {
          path: "/request-access",
          element: <RequestAccess />,
        },
        {
          path: "/pending-requests"
          ,
          element:<PendingRequest/>
        },
        {
          path:"create-software",
          element:<CreateSoftware/>
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