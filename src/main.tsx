import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LandingPage from './pages/landingpage/LandingPage.tsx';
import JoinSession from './pages/joinsession/JoinSession.tsx';
import Petros from './Petros.tsx';
import ThanasisTest from "./Thanasis.tsx";
import SessionRoom from './pages/sessionroom/SessionRoom.tsx';

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
        path: "/join-session",
        element: <JoinSession />,
      },
      {
        path: "/join-session/:sessionId",
        element: <SessionRoom />
      },
      {
        path: "/join-session/:sessionId/color/:colorId",
        element: <Petros />,
      },
      {
        path: "/mouse-event-test",
        element: <Petros />,
      },
      {
        path: "thanasis",
        element: <ThanasisTest/>,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
