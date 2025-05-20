'use client';

import Header from "@/app/components/header";
import ChatSection from "./components/chat-section";
import withAuth from "@/app/components/withAuth";

function Home() {
  return (
    <main className="h-screen w-screen flex flex-col bg-gray-100 dark:bg-zinc-900">
      <Header />
      <div className="flex-1 overflow-hidden flex justify-center">
        <div className="w-full max-w-3xl flex flex-col bg-white dark:bg-zinc-800 rounded-xl shadow-sm mx-4 my-6 p-4">
          <ChatSection />
        </div>
      </div>
    </main>
  );
}

export default withAuth(Home);
