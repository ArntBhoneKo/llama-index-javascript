"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Optional: force dark mode on login page load
  useEffect(() => {
    const html = document.documentElement;
    const stored = localStorage.getItem("theme");

    if (stored === "dark" || !stored) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === "admin" && password === "admin@2025") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
      <form
        onSubmit={handleLogin}
        className="p-8 bg-white dark:bg-zinc-800 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl mb-4 text-gray-800 dark:text-white">Login</h1>

        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white p-2 mb-2 w-full rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white p-2 mb-4 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
