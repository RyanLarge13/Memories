import { headers } from "next/headers";
import { FaCog, FaImages, FaPlus } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";

import { SignedIn, UserButton } from "@clerk/nextjs";

const Nav = () => {
  // Setting x-pathname header in root/middleware.ts
  const reqHeaders = headers();
  const path = reqHeaders.get("x-pathname") || "/";

  return (
    <nav className="p-1 flex items-center justify-center fixed z-40 top-0 right-0 left-0 bg-white">
      <ul className="flex justify-between items-center self-center">
        <li>
          <a
            href="/"
            className={`md:hidden px-10 duration-200 hover:text-sky-700 ${
              path === "/" ? "text-sky-400" : "text-black"
            }`}
          >
            <FaImages />
          </a>
          <a
            href="/"
            className={`hidden py-3 md:block px-10 duration-200 hover:text-sky-700 ${
              path === "/" ? "text-sky-400" : "text-black"
            }`}
          >
            Feed
          </a>
        </li>
        <li>
          <a
            href="/profile"
            className={`md:hidden px-10 duration-200 hover:text-sky-700 ${
              path === "/profile" ? "text-sky-400" : "text-black"
            }`}
          >
            <FaPerson />
          </a>
          <a
            href="/profile"
            className={`hidden py-3 md:block px-10 duration-200 hover:text-sky-700 ${
              path === "/profile" ? "text-sky-400" : "text-black"
            }`}
          >
            Profile
          </a>
        </li>
        <li>
          <a
            href="/settings"
            className={`md:hidden px-10 duration-200 hover:text-sky-700 ${
              path === "/settings" ? "text-sky-400" : "text-black"
            }`}
          >
            <FaCog />
          </a>
          <a
            href="/settings"
            className={`hidden py-3 md:block px-10 duration-200 hover:text-sky-700 ${
              path === "/settings" ? "text-sky-400" : "text-black"
            }`}
          >
            Settings
          </a>
        </li>
        <li>
          <a
            href="/new"
            className={`md:hidden px-10 duration-200 hover:text-sky-700 ${
              path === "/new" ? "text-sky-400" : "text-black"
            }`}
          >
            <FaPlus />
          </a>
          <a
            href="/new"
            className={`hidden py-3 md:block px-10 duration-200 hover:text-sky-700 ${
              path === "/new" ? "text-sky-400" : "text-black"
            }`}
          >
            New
          </a>
        </li>
      </ul>
      <div className="absolute top-[50%] translate-y-[-50%] right-3">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Nav;
