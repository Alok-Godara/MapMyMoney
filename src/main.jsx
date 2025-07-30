import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store.js";
import App from "./App.jsx";
import "./index.css";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CompanyDetail from "./pages/CompanyDetail.jsx";
import AuthCallback from "./components/AuthCallback.jsx";
import CustomErrorPage from "./components/CustomErrorPage.jsx";
import React from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/Dashboard",
        element: <Dashboard />,
      },
      { path: "auth/callback", 
        element: <AuthCallback /> },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/CompanyDetail/:companyId",
        element: <CompanyDetail />,
      },
    ],
    errorElement: <CustomErrorPage />
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
