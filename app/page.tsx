'use client';

import Header from "@/app/components/header";
import ChatSection from "./components/chat-section";
import withAuth from "@/app/components/withAuth";

function Home() {
  return (
    <main className="h-screen w-screen flex flex-col bg-black text-white">
      <Header />
      <div className="flex-1 flex flex-col overflow-hidden pt-14">
        <ChatSection />
      </div>
    </main>
  );
}

export default withAuth(Home);
