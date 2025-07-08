"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    const html = document.documentElement;
    const stored = localStorage.getItem("theme");

    if (stored === "dark" || !stored) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    getProviders().then(setProviders);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
      <div className="p-8 bg-white dark:bg-zinc-800 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl mb-6 text-gray-800 dark:text-white text-center">Sign In</h1>
        
        {providers && Object.values(providers).map((provider: any) => (
          <button
            key={provider.name}
            onClick={() => signIn(provider.id, { callbackUrl: '/' })}
            className="w-full mb-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition flex items-center justify-center gap-2"
          >
            Sign in with {provider.name}
          </button>
        ))}
      </div>
    </div>
  );
}
