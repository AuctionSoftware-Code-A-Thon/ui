import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GlobalContext } from "../..";
import { SERVER_PORT, SERVER_URL } from "../../helpers/constants";
import ConfirmationModel from "../confirmation/confirmation";

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isInactive, setIsInactive] = useState(false);
  const { isCurrentSessionActive, setCurrentSessionActive } =
    useContext(GlobalContext);
  const updateExpireTime = () => {
    const expireTime = Date.now() + 60000;
    localStorage.setItem("aution_software_code-A-Thon", expireTime);
  };
  const checkIfActive = () => {
    if (
      localStorage.getItem("aution_software_code-A-Thon") &&
      localStorage.getItem("aution_software_code-A-Thon") < Date.now()
    ) {
      setIsInactive(true);
    }
    if (
      localStorage.getItem("aution_software_code-A-Thon") &&
      localStorage.getItem("aution_software_code-A-Thon") < Date.now()
    ) {
      handleLogOut();
    }
  };
  const handleLogOut = async () => {
    await axios
      .get(`${SERVER_URL}:${SERVER_PORT}/auth/logout`, {
        withCredentials: true,
      })
      .then(
        (res) => {
          if (res.status === 200) {
            setCurrentSessionActive(false);
          }
        },
        (error) => {
          setCurrentSessionActive(false);
        }
      );
    navigate("/");
  };
  useEffect(() => {
    updateExpireTime();
    window.addEventListener("click", updateExpireTime);
    window.addEventListener("keypress", updateExpireTime);
    window.addEventListener("scroll", updateExpireTime);
    window.addEventListener("mousemove", updateExpireTime);
    return () => {
      window.removeEventListener("click", updateExpireTime);
      window.removeEventListener("keypress", updateExpireTime);
      window.removeEventListener("scroll", updateExpireTime);
      window.removeEventListener("mousemove", updateExpireTime);
    };
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      checkIfActive();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, []);

  return isCurrentSessionActive ? (
    <>
      {children}{" "}
      <ConfirmationModel
        subtitle={
          "Uh-oh! Looks like you've been taking a little break. Just a heads up: You'll be logged out in 10 seconds. Do you like to extend the session?"
        }
        no={() => handleLogOut()}
        yes={() => setIsInactive(false)}
        open={isInactive}
      />
    </>
  ) : (
    <Navigate to="/" />
  );
};
export default PrivateRoute;
