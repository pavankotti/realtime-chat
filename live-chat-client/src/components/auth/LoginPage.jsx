import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Toaster from '../common/Toaster'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { CircularProgress, IconButton } from '@mui/material'

function LoginPage() {
  const [data, setData] = useState({ name: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleGuestLogin = () => {
    setLoginStatus({ msg: "Use demo credentials: username 'guest', password 'guest123'", key: Math.random(), severity: "info" });
  }

  return (
    <div className="flex w-full h-full">

      {/* Left decorative panel — animated floating circles */}
      <div className="hidden md:flex md:flex-col items-center justify-center md:w-[40%] relative overflow-hidden bg-gradient-to-br from-[#6366f1] to-[#818cf8]">
        {/* Animated floating blobs */}
        <div className="animate-float-1 absolute top-[-60px] left-[-60px] w-48 h-48 rounded-full bg-white/10" />
        <div className="animate-float-2 absolute bottom-[-40px] right-[-40px] w-64 h-64 rounded-full bg-white/10" />
        <div className="animate-float-3 absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-white/8" />
        <div className="animate-float-4 absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-white/[0.06]" />
        <div className="animate-float-1 absolute top-1/4 right-1/4 w-14 h-14 rounded-full bg-white/10" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 flex flex-col items-center text-center px-10">
          {/* Glassy logo card */}
          <div className="glass w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-4xl">💬</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">LiveChat</h1>
          <p className="text-white/80 text-base leading-relaxed max-w-xs">
            Connect instantly with people around the world. Fast, secure, and beautifully simple.
          </p>
        </div>
      </div>

      {/* Right form panel — soft drop-shadow card */}
      <div className="flex w-full md:w-[60%] items-center justify-center p-6 bg-container">
        <div className="w-full max-w-sm bg-container rounded-2xl p-8 shadow-[0_8px_40px_-8px_rgba(99,102,241,0.18)] ring-1 ring-border-subtle">
          <h2 className="text-3xl font-bold text-primary mb-1">Welcome back 👋</h2>
          <p className="text-secondary text-sm mb-8">Sign in to your account</p>

          {/* Username input with purple glow on focus */}
          <div className="flex items-center gap-3 bg-input rounded-xl px-4 py-3 mb-4 ring-1 ring-transparent focus-within:ring-accent focus-glow transition-all">
            <PersonOutlineIcon sx={{ color: 'var(--text-icon)', fontSize: 20 }} />
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={data.name}
              onChange={changeHandler}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary text-sm"
            />
          </div>

          {/* Password input with purple glow on focus */}
          <div className="flex items-center gap-3 bg-input rounded-xl px-4 py-3 mb-6 ring-1 ring-transparent focus-within:ring-accent focus-glow transition-all">
            <LockOutlinedIcon sx={{ color: 'var(--text-icon)', fontSize: 20 }} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={changeHandler}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary text-sm"
            />
            <IconButton
              size="small"
              onClick={() => setShowPassword(v => !v)}
              sx={{ color: 'var(--text-icon)', padding: 0 }}
            >
              {showPassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </div>

          {/* Sign In button — shimmer on hover via CSS */}
          <button
            onClick={loginHandler}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : "Sign In"}
          </button>

          {loginStatus && (
            <Toaster
              message={loginStatus.msg}
              severity={loginStatus.severity}
              open={!!loginStatus}
              handleClose={handleClose}
            />
          )}

          <p className="text-sm text-secondary mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-accent hover:underline">
              Sign Up
            </Link>
          </p>

          {/* Guest / demo access */}
          <p className="text-xs text-secondary mt-3 text-center">
            Just browsing?{' '}
            <button
              onClick={handleGuestLogin}
              className="text-accent/70 hover:text-accent underline underline-offset-2 transition-colors"
            >
              Continue as Guest
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
