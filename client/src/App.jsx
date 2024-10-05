import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashBoardPage from './pages/DashBoardPage';
import ChatPage from './pages/ChatPage';
import DashBoardLayout from './layouts/DashBoardLayout';
import RootLayout from './layouts/RootLayout';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';

export default function App() {
  const router = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        {
          path: '/sign-up',
          element: <SignUpPage />
        },
        {
          path: '/sign-in',
          element: <SignInPage />
        },
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
  
    