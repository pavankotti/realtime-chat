import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Toaster from '../common/Toaster'

function SignUp() {
    const [data, setData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [signinStatus, setSigninStatus] = useState(null);

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
                        Create an Account
                    </h1>

                    <p className="text-gray-500 text-sm mb-6">
                        Sign up to continue chatting
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
                        type="text"
                        name="email"
                        placeholder="Enter your Email"
                        value={data.email}
                        onChange={changeHandler}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-3 mb-4 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-[#06daae]"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Create Password"
                        value={data.password}
                        onChange={changeHandler}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-3 mb-6 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-[#06daae]"
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={data.confirmPassword}
                        onChange={changeHandler}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-3 mb-6 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-[#06daae]"
                    />

                    <button
                        onClick={signUpHandler}
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-[#06daae] text-white font-semibold hover:bg-[#05c2a0] transition disabled:opacity-50">
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>

                    {signinStatus && (
                        <Toaster
                            message={signinStatus.msg}
                            severity={signinStatus.severity}
                            open={!!signinStatus}
                            handleClose={handleClose}
                        />
                    )}

                    <p className="text-xs text-gray-500 mt-6 text-center">
                        Already have an account? <Link to="/login" className="text-[#06daae] cursor-pointer font-medium hover:underline">Login</Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default SignUp
