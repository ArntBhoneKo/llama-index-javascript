'use client';

import { useState } from "react";
import { Bars3Icon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import MenuModal from "./ui/menu";
import SettingsModal from "./ui/setting";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <div className="fixed top-0 left-0 z-10 w-full border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
          
          {/* Icons */}
          <div className="flex items-center gap-4">
            <Bars3Icon
              className="w-6 h-6 text-gray-700 dark:text-white cursor-pointer"
              onClick={() => setShowMenu(true)}
            />
            <Cog6ToothIcon
              className="w-6 h-6 text-gray-700 dark:text-white cursor-pointer"
              onClick={() => setShowSettings(true)}
            />
          </div>

          {/* Title */}
          <Link href="/" className="text-center">
            <code className="font-mono font-bold">NEX4 ICT Solutions</code>
          </Link>

          {/* User info and sign out */}
          <div className="flex items-center gap-2">
            {session?.user?.name && (
              <span className="text-sm text-gray-700 dark:text-white hidden sm:block">
                {session.user.name}
              </span>
            )}
            <ArrowRightOnRectangleIcon
              className="w-6 h-6 text-gray-700 dark:text-white cursor-pointer"
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Sign Out"
            />
          </div>
        </div>
      </div>

      {showMenu && <MenuModal onClose={() => setShowMenu(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
