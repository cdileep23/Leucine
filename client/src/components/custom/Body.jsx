import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./Navbar";
import { BASE_URL } from "@/utils/url";
import { userLoggedIn } from "@/store/user";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const isAuthRoute = location.pathname.includes("/auth");

  const fetchUser = async () => {
    console.log(user)
    if (user) return;
    try {
      const response = await axios.get(`${BASE_URL}/auth/user`, {
        withCredentials: true,
      });
      console.log(response);
      dispatch(userLoggedIn(response.data.user));

      if (isAuthRoute) {
        navigate("/");
      }
    } catch (error) {
      console.log(error)
        navigate("/auth");
    
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  console.log("Body");
  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthRoute && <Navbar />}
      <main className={isAuthRoute ? "" : "pt-16 flex-grow"}>
        <div className="max-w-6xl mx-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Body;
