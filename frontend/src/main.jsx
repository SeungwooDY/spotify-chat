import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import App from './App.jsx'

// pages
import LikedSongsPage from './pages/LikedSongsPage.jsx';
import DiscoverPage from './pages/DiscoverPage.jsx';
import TopArtistsPage from './pages/TopArtistsPage.jsx';
import ForumPage from './pages/ForumPage.jsx';
import TopSongsPage from './pages/TopSongsPage.jsx';
import InboxPage from './pages/InboxPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <DiscoverPage />
      },
      {
        path: "/liked-songs",
        element: <LikedSongsPage />
      }, 
      {
        path: "/top-artists",
        element: <TopArtistsPage />
      },
      {
        path: "forum",
        element: <ForumPage />
      },
      {
        path: "top-songs",
        element: <TopSongsPage />
      },
      {
        path: "inbox",
        element: <InboxPage />
      },
      {
        path: "profile",
        element: <ProfilePage />
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
