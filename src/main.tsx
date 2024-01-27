import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CreateSession from './pages/createsession/CreateSession.tsx';
import LandingPage from './pages/landingpage/LandingPage.tsx';
import JoinSession from './pages/joinsession/JoinSession.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "/create-session",
        element: <CreateSession />,
      },
      {
        path: "/join-session",
        element: <JoinSession />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
