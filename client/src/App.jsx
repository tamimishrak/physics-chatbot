import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashBoardPage from './pages/DashBoardPage';
import ChatPage from './pages/ChatPage';
import DashBoardLayout from './layouts/DashBoardLayout';
import RootLayout from './layouts/RootLayout';

export default function App() {
  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          element: <DashBoardLayout />,
          children: [
            {
              path: '/dashboard', element: <DashBoardPage />
            },
            {
              path: '/dashboard/sessions/:id', element: <ChatPage />
            }
          ]
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={router}/>
  )
}
  
    