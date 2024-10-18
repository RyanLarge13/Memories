import React from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { FaCog, FaImages, FaPlus } from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";

const Nav = () => {
  return (
    <nav className="p-1 flex items-center justify-center fixed z-40 top-0 right-0 left-0 bg-white">
      <ul className="flex justify-between items-center self-center">
        <li>
          <a
            href="/"
            className="md:hidden px-10 duration-200 hover:text-sky-500"
          >
            <FaImages />
          </a>
          <a
            href="/"
            className="px-10 hover:shadow-lg duration-300 hidden md:block"
          >
            Feed
          </a>
        </li>
        <li>
          <a
            href="/profile"
            className="md:hidden px-10 py-1 duration-200 hover:text-sky-500"
          >
            <FaPerson />
          </a>
          <a
            href="/profile"
            className="px-10 py-3 hover:shadow-lg duration-300 hidden md:block"
          >
            Profile
          </a>
        </li>
        <li>
          <a
            href="/settings"
            className="md:hidden px-10 py-1 duration-200 hover:text-sky-500"
          >
            <FaCog />
          </a>
          <a
            href="/settings"
            className="px-10 py-3 hover:shadow-lg duration-300 hidden md:block"
          >
            Settings
          </a>
        </li>
        <li>
          <a
            href="/new"
            className="md:hidden px-10 py-1 duration-200 hover:text-sky-500"
          >
            <FaPlus />
          </a>
          <a
            href="/new"
            className="px-10 py-3 hover:shadow-lg duration-300 hidden md:block"
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
