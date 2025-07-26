import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "./supabase/auth";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
function App() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check user authentication status
    const checkAuth = async () => {
      const {data, error} = await authService.getCurrentUserService();
      if (data) {
        dispatch(login({ data, isLoggedIn: true }));
      } else {
        dispatch(logout());
        navigate("/login");
      }
    };

    checkAuth();
    setLoading(false);
  }, []);


  return loading ? (
    <div>Loading...</div>
  ) : (
      <main>
        <Outlet />
      </main>
  );
}

export default App;
