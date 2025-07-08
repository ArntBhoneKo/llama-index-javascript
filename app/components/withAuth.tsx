"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(Component: React.FC) {
  return function ProtectedComponent(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;
      if (!session) {
        router.push("/login");
      }
    }, [session, status, router]);

    if (status === "loading") {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
          <div className="text-gray-800 dark:text-white">Loading...</div>
        </div>
      );
    }

    if (!session) {
      return null;
    }

    return <Component {...props} />;
  };
}
