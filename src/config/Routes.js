import { Navigate } from "react-router-dom"
import ForgotPassword from "../pages/forgot-password/ForgotPassword"
import Dashboard from "../pages/dashboard/Dashboard"
import Login from "../pages/login/Login"
import PathList from "./Paths"

const routesList = {
    private: [
      {
        path: PathList.dashboard,
        name: PathList.dashboard.slice(1, PathList.dashboard.length),   // cut out slash from pathlist
        exact: true,
        element: Dashboard,
        eleFallback: Navigate,
        toFallback: PathList.login,
        props: [{routePath: PathList.dashboard}]
      },
    ],
    public: [
      {
        path: PathList.login,
        name: PathList.login.slice(1, PathList.login.length),   // cut out slash from pathlist
        exact: true,
        element: Login,
        eleFallback: Navigate,
        toFallback: PathList.dashboard,
        props: []
      },
      {
        path: PathList.forgotPassword,
        name: PathList.forgotPassword.slice(1, PathList.forgotPassword.length),   // cut out slash from pathlist
        exact: true,
        element: ForgotPassword,
        eleFallback: Navigate,
        toFallback: PathList.updateProfile,
        props: []
      },
    ]
}

export default routesList