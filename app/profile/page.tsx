import Memories from "@/components/Memories";
import ProfileMemories from "@/components/ProfileMemories";
import {
  getUserSettings,
  getUsersPosts,
  createDefaultSettings,
} from "@/useServer";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";
import { FaLink } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";

export const generateMetadata = async (): Promise<Metadata> => {
  const user = await currentUser();
  if (!user) {
    return {
      title: "Profile",
      description: "Welcome to your profile on Memory!",
    };
  }
  const userSettings = await getUserSettings(user.id);
  return {
    title: `@${user?.firstName}${user?.lastName}`,
    description: userSettings?.bio,
  };
};

const Profile = async () => {
  const user = await currentUser();
  if (!user) {
    return <div>No user</div>;
  }
  const posts = await getUsersPosts(user.id);
  const settings = await getUserSettings(user.id);

  if (!settings) {
    const defaultSettingsCreated = await createDefaultSettings(user.id);
    if (defaultSettingsCreated) {
      console.log("created user settings");
    } else {
      console.log("Failed to create default settings");
    }
  }

  return (
    <section className="pt-20">
      <div className="flex flex-col justify-center items-center">
        <Image
          src={user.imageUrl}
          alt="user"
          width={40}
          height={40}
          className="w-20 h-20 rounded-full object-cover"
        />
        <h1 className="text-2xl font-semibold">{`${user.firstName}${user.lastName}`}</h1>
        <div className="flex justify-center items-center gap-x-2 my-2">
          <p>Posts {posts.length}</p>
          <p>Followers {settings?.followers.length || 0}</p>
          <p>Following {settings?.following.length || 0}</p>
        </div>
        <div className="text-left w-full px-5">
          <p className="text-sm text-slate-700">{settings?.title}</p>
          <p className="flex justify-start items-center gap-x-1">
            <FaLocationPin className="text-xs" />
            {settings?.location}
          </p>
          {settings?.link ? (
            <a
              href={settings.link}
              target="_blank"
              className="text-sm text-sky-700 font-bold flex justify-start items-center"
            >
              <FaLink className="mr-1" />{" "}
              {settings.link.replace(/^https?:\/\//, "")}
            </a>
          ) : null}
          {settings?.bio ? <p className="mt-1">"{settings?.bio}"</p> : null}
        </div>
      </div>
      <ProfileMemories posts={posts}>
        <section className="fixed inset-0 z-40 bg-white p-3 overflow-y-auto py-10">
          {posts.map((post) => (
            <Memories key={post.id} memory={post} />
          ))}
        </section>
      </ProfileMemories>
    </section>
  );
};

export default Profile;
