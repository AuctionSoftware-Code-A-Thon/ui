import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

export const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [isCurrentSessionActive, setCurrentSessionActive] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);
  const [projects, setProjects] = useState();
  const [filterGames, setFilterGames] = useState();
  const [typeFilter, setTypeFilter] = useState(["All"]);
  const incrementLoading = () => {
    setLoadingCount((prevCount) => prevCount + 1);
  };

  const decrementLoading = () => {
    setLoadingCount((prevCount) => prevCount - 1);
  };
  const applyFilter = (name, type) => {
    const res = projects.filter(
      (item) =>
        item?.name.toLowerCase().includes(name.toLowerCase()) &&
        (item?.type.includes(type) || type === "All")
    );
    setFilterGames(res);
  };
  const isLoading = loadingCount > 0;

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        incrementLoading,
        decrementLoading,
        filterGames,
        projects,
        setProjects,
        applyFilter,
        setFilterGames,
        typeFilter,
        setTypeFilter,
        isCurrentSessionActive,
        setCurrentSessionActive,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
