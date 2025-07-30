import React, { useState, useEffect } from "react";
import authService from "../supabase/auth";
import { LogOut, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const AuthLayout = ({ children, title = "MapMyMoney" }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await authService.logoutService();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Logo className="h-8 w-8 text-white" />
              <h1 className="text-3xl font-bold text-white">MapMyMoney</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <User className="h-5 w-5" />
                <span className="text-sm">
                  {user?.user_metadata?.name || user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4 hover:cursor-pointer" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;
