import { createBrowserRouter } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext/SearchProvider';
import { AuthProvider } from './context/AuthContext/AuthProvider';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';
import { VideoPage } from './pages/VideoPage/VideoPage';
import { ChannelPage } from './pages/ChannelPage/ChannelPage';
import ErrorPage from './pages/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: '/register',
    element: (
      <AuthProvider>
        <Register />
      </AuthProvider>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: '/',
    element: (
      <AuthProvider>
        <SearchProvider>
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        </SearchProvider>
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'video/:videoId',
        element: <VideoPage />
      },
      {
        path: 'channel/:channelId',
        element: <ChannelPage />
      }
    ]
  },
  {
    path: '*',
    element: <ErrorPage />,
    errorElement: <ErrorPage />
  }
]);

export default router;
