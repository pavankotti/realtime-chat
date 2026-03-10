import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Toaster from '../common/Toaster'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { CircularProgress, IconButton } from '@mui/material'

function SignUp() {
    const [data, setData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [signinStatus, setSigninStatus] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) navigate("/app");
    }, [navigate]);

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSigninStatus(null);
    };

    const signUpHandler = async () => {
        setLoading(true);
        // Validation Check
        if (!data.name || !data.email || !data.password || !data.confirmPassword) {
            setLoading(false);
            setSigninStatus({
                msg: "All fields are required",
                key: Math.random(),
                severity: "warning"
            });
            return;
        }

        if (data.password !== data.confirmPassword) {
            setLoading(false);
            setSigninStatus({
                msg: "Passwords didn't match. Try again.",
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
                `${import.meta.env.VITE_API_URL}/api/user/register`,
                data,
                config
            );
            console.log("Signup success", response);
            setSigninStatus({ msg: "Success", key: Math.random(), severity: "success" });
            setLoading(false);
            localStorage.setItem("userInfo", JSON.stringify(response.data));
            navigate("/app");
        } catch (error) {
            console.log("Signup error", error);
            // Capture specific server message if available
            const serverMsg = error.response?.data?.message;
            if (error.response?.status === 409 || error.response?.status === 400) {
                setSigninStatus({
                    msg: serverMsg || "User already exists",
                    key: Math.random(),
                    severity: "error"
                });
            } else {
                // Determine generic failure or server specific error
                setSigninStatus({
                    msg: serverMsg || "Registration failed",
                    key: Math.random(),
                    severity: "error"
                });
            }
            setLoading(false);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            signUpHandler();
        }
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

            {/* Right form panel */}
            <div className="flex w-full md:w-[60%] items-center justify-center p-6 bg-container overflow-y-auto">
                <div className="w-full max-w-sm py-4">
                    <h2 className="text-3xl font-bold text-primary mb-1">Create account ✨</h2>
                    <p className="text-secondary text-sm mb-8">Join thousands of users today</p>

                    {/* Name input */}
                    <div className="flex items-center gap-3 bg-input rounded-xl px-4 py-3 mb-4 ring-1 ring-transparent focus-within:ring-accent transition-all">
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

                    {/* Email input */}
                    <div className="flex items-center gap-3 bg-input rounded-xl px-4 py-3 mb-4 ring-1 ring-transparent focus-within:ring-accent transition-all">
                        <EmailOutlinedIcon sx={{ color: 'var(--text-icon)', fontSize: 20 }} />
                        <input
                            type="text"
                            name="email"
                            placeholder="Email address"
                            value={data.email}
                            onChange={changeHandler}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary text-sm"
                        />
                    </div>

                    {/* Password input */}
                    <div className="flex items-center gap-3 bg-input rounded-xl px-4 py-3 mb-4 ring-1 ring-transparent focus-within:ring-accent transition-all">
                        <LockOutlinedIcon sx={{ color: 'var(--text-icon)', fontSize: 20 }} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Create password"
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

                    {/* Confirm Password input */}
                    <div className="flex items-center gap-3 bg-input rounded-xl px-4 py-3 mb-6 ring-1 ring-transparent focus-within:ring-accent transition-all">
                        <LockOutlinedIcon sx={{ color: 'var(--text-icon)', fontSize: 20 }} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={data.confirmPassword}
                            onChange={changeHandler}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary text-sm"
                        />
                        <IconButton
                            size="small"
                            onClick={() => setShowConfirmPassword(v => !v)}
                            sx={{ color: 'var(--text-icon)', padding: 0 }}
                        >
                            {showConfirmPassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                    </div>

                    <button
                        onClick={signUpHandler}
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : "Create Account"}
                    </button>

                    {signinStatus && (
                        <Toaster
                            message={signinStatus.msg}
                            severity={signinStatus.severity}
                            open={!!signinStatus}
                            handleClose={handleClose}
                        />
                    )}

                    <p className="text-sm text-secondary mt-6 text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-accent hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
