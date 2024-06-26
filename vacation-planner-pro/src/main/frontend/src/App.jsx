import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth } from './api/authApi';
import Root from './pages/Root';
import Error from './Error';
import LogIn from './pages/LogIn';
import Calendar from './pages/Calendar';
import SignUp from './pages/SignUp';
import CreateVacationRev from './pages/CreateVacationRevised';
import UpdateVacation from './pages/UpdateVacation';
import VacationProfiles from './pages/Reports';
import AboutUs from './pages/AboutUs';

const isAuthenticated = async () => {
  try {
    const response = await getAuth();
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ element }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? element : <Navigate to="/login" />;
};

const routes = [
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: isAuthenticated() ? (
          <Navigate to="/calendar" />
        ) : (
          <Navigate to="/login" />
        ),
      },
      {
        path: 'login',
        element: <LogIn />,
      },
      {
        path: 'reports',
        element: <ProtectedRoute element={<VacationProfiles />} />,
      },
      {
        path: 'calendar',
        element: <ProtectedRoute element={<Calendar />} />,
      },
      {
        path: 'calendar/create',
        element: <ProtectedRoute element={<CreateVacationRev />} />,
      },
      {
        path: 'calendar/update',
        element: <ProtectedRoute element={<UpdateVacation />} />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'about',
        element: <AboutUs />,
      },
    ],
  },
];
const router = createBrowserRouter(routes);

export default function App() {
  return (
    <RouterProvider router={router}>{router.startupElement}</RouterProvider>
  );
}
