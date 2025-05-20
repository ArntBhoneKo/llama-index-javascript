"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  FaConciergeBell,
  FaEnvelope,
  FaFileContract,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function MenuModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    {
      label: "Our Services",
      href: "/services",
      icon: <FaConciergeBell />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Contact Us",
      href: "/contact",
      icon: <FaEnvelope />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Terms and Conditions",
      href: "/terms",
      icon: <FaFileContract />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Security",
      href: "/security",
      icon: <FaShieldAlt />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  }

  // Close modal if clicking outside the content
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">Menu</h1>

        <ul className="space-y-3">
          {menuItems.map(({ label, href, icon, color }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:shadow-lg hover:-translate-y-1 transition-transform"
              >
                <span className={`p-2 rounded-full flex-shrink-0 ${color}`}>{icon}</span>
                <span className="flex-1 text-left font-medium text-gray-800 dark:text-gray-200">{label}</span>
              </Link>
            </li>
          ))}

          <li>
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:shadow-lg hover:-translate-y-1 transition-transform"
            >
              <span className="p-2 rounded-full bg-red-100 text-red-600">
                <FaSignOutAlt />
              </span>
              <span className="flex-1 text-left font-medium text-gray-800 dark:text-gray-200">Logout</span>
            </button>
          </li>
        </ul>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center py-2 rounded-lg bg-white dark:bg-zinc-700 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
