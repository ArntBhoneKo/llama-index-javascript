'use client';

import Image from "next/image";
import { Bars3Icon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function Header() {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 z-10 w-full border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
        
        {/* Icons */}
        <div className="flex items-center gap-4">
          <Bars3Icon
            className="w-6 h-6 text-gray-700 dark:text-white cursor-pointer"
            onClick={() => router.push('/menu')}
          />
          <Cog6ToothIcon
            className="w-6 h-6 text-gray-700 dark:text-white cursor-pointer"
            onClick={() => router.push('/settings')}
          />
        </div>

        {/* Title */}
        <Link href="/" className="text-center">
          <code className="font-mono font-bold">NEX4 ICT Solutions</code>
        </Link>

        {/* Optional: Placeholder for spacing/alignment */}
        <div className="w-12" />
      </div>
    </div>
  );
}
