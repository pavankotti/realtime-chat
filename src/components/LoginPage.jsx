import React from 'react'

function LoginPage() {
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
          w-full md:w-105
          bg-white
          rounded-2xl
          p-6 md:p-8
          shadow-[0_18px_35px_-15px_rgba(6,218,174,0.35)]
        ">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome back!!
          </h1>

          <p className="text-gray-500 text-sm mb-6">
            Login to continue chatting
          </p>

          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 mb-4 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-[#06daae]"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 mb-6 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-[#06daae]"
          />

          <button className="w-full py-3 rounded-xl bg-[#06daae] text-white font-semibold hover:bg-[#05c2a0] transition">
            Login
          </button>

          <p className="text-xs text-gray-500 mt-6 text-center">
            Don't have an account? <span className="text-[#06daae] cursor-pointer">Sign up</span>
          </p>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
