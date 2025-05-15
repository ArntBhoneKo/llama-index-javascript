import Header from "@/app/components/header";
import ChatSection from "./components/chat-section";

export default function Home() {
  return (
    <main className="h-screen w-screen flex flex-col bg-white dark:bg-zinc-900">
        <Header />
        <div className="flex-1 overflow-hidden flex justify-center">
          <div className="w-full max-w-3xl flex flex-col">
            <ChatSection />
          </div>
        </div>
    </main>
  );
}
