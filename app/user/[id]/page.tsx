import FollowBtn from "@/components/FollowBtn";
import Memories from "@/components/Memories";
import UserMemories from "@/components/UserMemories";
import { getUserSettings, getUsersPosts } from "@/useServer";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import { FaLink } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const id = params.id;
  const user = await clerkClient.users.getUser(id);
  const userSettings = await getUserSettings(user.id);
  return {
    title: `@${user.firstName}${user.lastName}`,
    description: userSettings?.bio,
  };
};

const User = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const user = await clerkClient.users.getUser(id);
  const currentAuthUser = await currentUser();
  if (!id || !user || !currentAuthUser) {
    return <p>No profile found!</p>;
  }
  if (currentAuthUser && currentAuthUser.id === user.id) {
    redirect("/profile");
  }

  const userMemories = await getUsersPosts(id);
  const userSettings = await getUserSettings(user.id);
  const appUser = await currentUser();

  return (
    <main>
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
            <p>Posts {userMemories.length}</p>
            <a href={`/followers/${id}`}>
              <p>Followers {userSettings?.followers.length || 0}</p>
            </a>
            <a href={`/following/${id}`}>
              <p>Following {userSettings?.following.length || 0}</p>
            </a>
          </div>
          <div className="text-left w-full px-5">
            <p className="text-sm text-slate-700">{userSettings?.title}</p>
            <p className="flex justify-start items-center gap-x-1">
              <FaLocationPin className="text-xs" /> {userSettings?.location}
            </p>
            {userSettings?.link ? (
              <a
                href={userSettings.link}
                target="_blank"
                className="text-sm text-sky-700 font-bold flex justify-start items-center"
              >
                <FaLink className="mr-1" />{" "}
                {userSettings.link.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
            {userSettings?.bio ? (
              <p className="mt-1">"{userSettings?.bio}"</p>
            ) : null}
          </div>
          {appUser ? (
            userSettings?.followers.includes(appUser.id) ? (
              <FollowBtn
                following={true}
                userToFollow={id}
                currentUser={appUser.id}
              />
            ) : (
              <FollowBtn
                following={false}
                userToFollow={id}
                currentUser={appUser.id}
              />
            )
          ) : null}
        </div>
        <UserMemories posts={userMemories}>
          {userMemories.map((post) => (
            <Memories key={post.id} memory={post} />
          ))}
        </UserMemories>
      </section>
    </main>
  );
};

export default User;
