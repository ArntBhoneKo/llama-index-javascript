"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
      <div className="p-8 bg-white dark:bg-zinc-800 rounded shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl mb-4 text-gray-800 dark:text-white">Login</h1>
        <button
          onClick={() => signIn("google")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
