import { createBrowserRouter } from "react-router";
import MainLayout from "./layout/main-layout";
import AuthLayout from "./layout/auth-layout";
import Home from "./pages/home/Home";
import Terms from "./pages/terms/Terms";
import Privacy from "./pages/privacy/Privacy";
import Login from "./pages/auth/login/Login";
import Signup from "./pages/auth/signup/Signup";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AdminLogin from "./pages/dashboard/AdminLogin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },
      {
        path: 'privacy',
        element: <Privacy />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/dashboard/login",
    element: <AdminLogin />,
  },
]);
