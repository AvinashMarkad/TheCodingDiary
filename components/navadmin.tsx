"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavAdmin() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null; // Prevent hydration mismatch

  return (
    <nav className="bg-white shadow">
      <header className="flex justify-between items-center p-4 max-w-7xl mx-auto h-16">
        {/* Left: Logo */}
        <div className="text-xl font-bold">
          <Link href="/home" className="flex items-center">
            <Image
              src="/static/images/terminal.png"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <ul className="flex space-x-6 items-center">
          <li>
            <Link
              href="/admin/home"
              className="text-gray-700 hover:text-blue-600"
            >
              Admin Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/user/home"
              className="text-gray-700 hover:text-blue-600"
            >
              Go Back to the Member Page
            </Link>
          </li>
        </ul>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>
    </nav>
  );
}
