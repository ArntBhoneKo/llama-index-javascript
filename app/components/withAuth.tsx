"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function withAuth(Component: React.FC) {
  return function ProtectedComponent(props: any) {
    const router = useRouter();

    useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn !== "true") {
        router.push("/login");
      }
    }, []);

    return <Component {...props} />;
  };
}
