// Library Imports
import { Card } from "react-bootstrap";

// Router Functionality
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "../../setup/PrivateRoute";
import PathList from "../../config/Paths";

// Authentication and Config
import { useAuth } from "../../contexts/auth-context/AuthContext";
import { useGlobal } from "../../contexts/global-context/GlobalContext";

// Styles
import "./styles.css";

// Page Components
import Login from "../../pages/login/Login";
import UpdateProfile from "../UpdateProfile";
import ForgotPassword from "../../pages/forgot-password/ForgotPassword";
import Dashboard from "../../pages/dashboard/Dashboard";
import BlackBoard from "../../pages/blackboard/BlackBoard";
import AddParticipant from "../../pages/dashboard/components/AddParticipant";
import { BlackboardProvider } from "../../contexts/blackboard-context/BlackboardContext";

export default function MainView() {
  const auth = useAuth();
  const { isFullscreen } = useGlobal();

  return (
    <Card className={isFullscreen() ? "MainView-fs" : "MainView"}>
      <Router>
        <Routes>
          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route exact path={PathList.dashboard} element={<Dashboard />} />
            <Route
              exact
              path={PathList.updateProfile}
              element={<UpdateProfile />}
            />
            <Route
              exact
              path={PathList.addParticipant}
              element={<AddParticipant />}
            />
            <Route
              exact
              path={PathList.stroopTask}
              element={<UpdateProfile />}
            />
            <Route exact path={PathList.settings} element={<UpdateProfile />} />
            <Route
              exact
              path={PathList.blackboard}
              element={
                <BlackboardProvider>
                  <BlackBoard />
                </BlackboardProvider>
              }
            />

            <Route
              exact
              path={PathList.home}
              element={
                auth.loginCheck() ? (
                  <Navigate to={PathList.dashboard} />
                ) : (
                  <Login />
                )
              }
            />

            {/* <Route path={PathList.signup}               
                                    element={LoginCheck() ? <Navigate to={PathList.dashboard}/> : <Signup/>} exact/> */}
          </Route>
          {/* Public Routes */}
          <Route
            exact
            path={PathList.login}
            element={
              auth.loginCheck() ? (
                <Navigate to={PathList.dashboard} />
              ) : (
                <Login />
              )
            }
          />

          <Route
            exact
            path={PathList.forgotPassword}
            element={
              auth.loginCheck() ? (
                <Navigate to={PathList.updateProfile} />
              ) : (
                <ForgotPassword />
              )
            }
          />
        </Routes>
      </Router>
    </Card>
  );
}
