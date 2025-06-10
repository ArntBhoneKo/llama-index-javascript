'use client';

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(Component: React.FC) {
  return function ProtectedComponent(props: any) {
    return (
      <SessionProvider>
        <InnerProtectedComponent Component={Component} {...props} />
      </SessionProvider>
    );
  };
}

function InnerProtectedComponent({
  Component,
  ...props
}: {
  Component: React.FC;
  [key: string]: any;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <Component {...props} />;
}
