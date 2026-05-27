import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import App from "./App.jsx";

// pages
import LikedSongsPage from "./pages/LikedSongsPage.jsx";
import DiscoverPage from "./pages/DiscoverPage.jsx";
import TopArtistsPage from "./pages/TopArtistsPage.jsx";
import ForumPage from "./pages/ForumPage.jsx";
import TopSongsPage from "./pages/TopSongsPage.jsx";
import InboxPage from "./pages/InboxPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Login from "./pages/Login.jsx";
import Callback from "./pages/Callback.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function requireAuth() {
  if (!sessionStorage.getItem("access_token")) {
    return redirect("/login");
  }
  return null;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
  {
    path: "/",
    element: <App />,
    loader: requireAuth,
    children: [
      {
        index: true,
        element: <DiscoverPage />,
      },
      {
        path: "liked-songs",
        element: <LikedSongsPage />,
      },
      {
        path: "top-artists",
        element: <TopArtistsPage />,
      },
      {
        path: "forum",
        element: <ForumPage />,
      },
      {
        path: "top-songs",
        element: <TopSongsPage />,
      },
      {
        path: "inbox",
        element: <InboxPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
