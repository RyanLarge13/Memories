import FollowBtn from "@/components/FollowBtn";
import UserMemories from "@/components/UserMemories";
import { getUserSettings, getUsersPosts } from "@/useServer";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";
import { FaLink } from "react-icons/fa";

const User = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const user = await clerkClient.users.getUser(id);
  if (!id || !user) {
    return <p>No profile found!</p>;
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
            <p>Followers {userSettings?.followers.length || 0}</p>
            <p>Following {userSettings?.following.length || 0}</p>
          </div>
          <div className="text-left w-full px-5">
            <p className="text-sm text-slate-700">{userSettings?.title}</p>
            <p>{userSettings?.location}</p>
            {userSettings?.link ? (
              <a
                href={userSettings.link}
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
              <FollowBtn following={true} />
            ) : (
              <FollowBtn following={false} />
            )
          ) : null}
        </div>
        <UserMemories posts={userMemories} />
      </section>
    </main>
  );
};

export default User;