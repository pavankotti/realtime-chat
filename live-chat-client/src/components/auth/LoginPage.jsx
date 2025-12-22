import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Toaster from '../common/Toaster'

function LoginPage() {
  const [data, setData] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/app");
    }
  }, [navigate]);

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setLoginStatus(null);
  };

  const loginHandler = async () => {
    setLoading(true);

    // Validation Check
    if (!data.name || !data.password) {
      setLoading(false);
      setLoginStatus({
        msg: "All fields are required",
        key: Math.random(),
        severity: "warning"
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        data,
        config
      );
      console.log("Login success", response);
      setLoginStatus({ msg: "Success", key: Math.random(), severity: "success" });
      setLoading(false);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      navigate("/app");
    } catch (error) {
      console.log("Login error", error);
      setLoginStatus({
        msg: error.response?.data?.message || "Invalid Username or Password",
        key: Math.random(),
        severity: "error"
      });
      setLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      loginHandler();
    }
  }

  return (
    <div className="flex w-full h-full">

      <div className="hidden md:flex md:flex-col items-center justify-center md:w-[40%] ">
        <img src="/live-chat.png" alt="Live Chat" className="w-80" />
        <p className="text-gray-500 text-sm mt-4 text-center px-6">
          Connect instantly with people around you.
        </p>
      </div>

      <div className="flex w-full md:w-[60%] items-center justify-center p-4">

        <div className="
          w-full max-w-md
          bg-white
          rounded-2xl
          p-6 md:p-8
          shadow-[0_18px_35px_-15px_rgba(6,218,174,0.35)]
        ">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome Back
          </h1>

          <p className="text-gray-500 text-sm mb-6">
            Login to continue chatting
          </p>

          <input
            type="text"
            name="name"
            placeholder="Username"
            value={data.name}
            onChange={changeHandler}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 mb-4 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-[#06daae]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={changeHandler}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 mb-6 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-[#06daae]"
          />

          <button
            onClick={loginHandler}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#06daae] text-white font-semibold hover:bg-[#05c2a0] transition disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>

          {loginStatus && (
            <Toaster
              message={loginStatus.msg}
              severity={loginStatus.severity}
              open={!!loginStatus}
              handleClose={handleClose}
            />
          )}

          <p className="text-xs text-gray-500 mt-6 text-center">
            Don't have an account? <Link to="/signup" className="text-[#06daae] cursor-pointer">Sign up</Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
