import SubmitButton from "@/components/SubmitButton";
import { getUserSettings, updateSettings } from "@/useServer";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import React from "react";
import { FaInfo } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Memory Settings",
  description:
    "Memories user settings page. Configure your account and update your profile",
};

const Settings = async () => {
  const user = await currentUser();
  if (!user) {
    return <p>Please login</p>;
  }
  const userSettings = await getUserSettings(user.id);

  return (
    <main>
      <section className="pt-20 px-3">
        <h1 className="text-xl mb019">Settings</h1>
        <p className="text-sm mt-3 flex justify-start items-center">
          <FaInfo className="text-xs mr-1" /> This information will be shown on
          your public profile
        </p>
        <form action={updateSettings} className="mt-5">
          {/* Use .bind instead of hidden inputs to include encoded data to form submission and progressive enhancements */}
          <input
            type="hidden"
            className="hidden"
            name="id"
            id="id"
            value={user.id}
          />
          <input
            type="text"
            name="username"
            id="username"
            placeholder={`Change Username @${user.firstName}${user.lastName}`}
            className="py-3 outline-none focus:outline-none"
          />
          <input
            type="text"
            name="title"
            id="title"
            placeholder={userSettings?.title || "What is your current title?"}
            className="py-3 outline-none focus:outline-none"
          />
          <input
            typeof="text"
            name="location"
            id="location"
            placeholder={userSettings?.location || "Where do you reside?"}
            className="py-3 outline-none focus:outline-none"
          />
          <input
            type="text"
            name="link"
            id="link"
            placeholder={userSettings?.link || "What is your website?"}
            className="py-3 outline-none focus:outline-none"
          />
          <textarea
            rows={4}
            maxLength={200}
            id="bio"
            name="bio"
            className="w-full mt-3"
            placeholder={userSettings?.bio || "Give yourself a bio"}
          ></textarea>
          <SubmitButton text="Update Settings" styles="" />
        </form>
        <a href="/delete/account" className="text-red-400 p-3 px-4 block">
          Delete Account
        </a>
      </section>
    </main>
  );
};

export default Settings;
