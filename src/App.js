import { Backdrop, CircularProgress } from "@mui/material";
import axios from "axios";
import { useContext, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GlobalContext } from ".";
import "./App.css";
import MyForm from "./components/form/form";
import Home from "./components/home/Home";
import PrivateRoute from "./components/private-route";
import ProjectPreview from "./components/project-preview/project.preview";
import { SignIn } from "./components/sign-in/signin";
import { SignUp } from "./components/sign-up/signup";
import { SERVER_PORT, SERVER_URL } from "./helpers/constants";

function App() {
  const { isLoading, setCurrentSessionActive } = useContext(GlobalContext);

  useEffect(() => {
    const isUserAuthenticated = async () => {
      axios
        .get(`${SERVER_URL}:${SERVER_PORT}/auth/isAuthenticated`, {
          withCredentials: true,
        })
        .then(
          (res) => {
            if (res.status === 200) {
              setCurrentSessionActive(true);
            }
          },
          (err) => {
            setCurrentSessionActive(false);
          }
        );
    };
    isUserAuthenticated();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="global-padding">
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<SignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/project/new"
              element={
                <PrivateRoute>
                  <MyForm />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/project/:id"
              element={
                <PrivateRoute>
                  <ProjectPreview />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/project/:id/edit"
              element={
                <PrivateRoute>
                  <MyForm />
                </PrivateRoute>
              }
            ></Route>
            <Route path="/" element={<Navigate to="/login" />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
