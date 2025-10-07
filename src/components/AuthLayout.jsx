import React from "react";
import authService from "../supabase/auth";
import { LogOut, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const AuthLayout = ({ children, title = "Finsync" }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authService.logoutService();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
  // Log sign-out errors for debugging
  console.error("Sign out error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center">
              <Logo className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              <h1 className="ml-2 text-xl sm:text-2xl lg:text-3xl font-bold text-white">{title}</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-gray-300">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm truncate max-w-32 sm:max-w-none">
                  {user?.user_metadata?.name || user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 sm:space-x-2 bg-red-600 hover:bg-red-700 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium transition-colors"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 hover:cursor-pointer" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
