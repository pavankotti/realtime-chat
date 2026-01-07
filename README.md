# 💬 Live Chat Application

Hey there! 👋 This is a full-stack real-time chat application I built to dive deep into modern web development. My goal was to create a seamless messaging experience that feels just as good as the apps we use every day.

It handles real-time communication, user authentication, and group chats—all wrapped up in a clean, responsive UI that I designed to look great on any device (plus, it has Dark Mode because why not?).

## 🚀 What It Does

- **Instant Messaging**: Chats happen in real-time, powered by **Socket.io**. No refreshing needed.
- **Secure Access**: I implemented **JWT** and **Bcrypt** to ensure user data stays safe.
- **Groups & Community**: Users can create group chats to hang out with multiple friends at once.
- **Live Status**: See who's online right now.
- **Responsive & Themed**: Built with **Material UI** and **TailwindCSS**, it adapts to mobile and desktop, with a smooth dark mode toggle.
- **Smart State**: Managed complex application state using **Redux Toolkit** for a snappy experience.

## 🛠️ How I Built It

### Client-Side
I used **React.js** (Vite) for the frontend because speed matters.
- **Redux Toolkit**: To keep the app state predictable and easy to debug.
- **Material UI** & **TailwindCSS**: For a polished, professional look without reinventing the wheel.
- **Socket.io Client**: To hook into the real-time backend events.

### Server-Side
The backend is a robust **Node.js** & **Express.js** API.
- **MongoDB**: My database of choice for flexibility.
- **Redis**: Integrated for caching and scaling websockets (optional but powerful).
- **Socket.io**: The engine behind the real-time magic.
- **JWT**: For stateless, secure authentication.

## 📂 Structure

I organized this as a monorepo to keep everything in one place:
- **/live-chat-client**: The frontend React app.
- **/live-chat-server**: The backend API and socket server.

## ⚡ Running It Locally

Want to try it out? Here is how you can get it up and running on your machine.

### Prerequisites
- Node.js (v18 or higher)
- A local MongoDB instance (or a cloud URI)
- Redis (Optional, if you want to test the caching features)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/pavankotti/realtime-chat.git
   cd realtime-chat
   ```

2. **Server Setup**
   ```bash
   cd live-chat-server
   npm install
   # You'll need a .env file here (PORT, MONGO_URI, JWT_SECRET)
   npm start
   ```

3. **Client Setup**
   ```bash
   cd live-chat-client
   npm install
   # npm run dev
   ```