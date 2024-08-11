import ProfileMemories from "@/components/ProfileMemories";
import { getUserSettings, getUsersPosts } from "@/useServer";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";
import { FaLink } from "react-icons/fa";

const Profile = async () => {
  const user = await currentUser();
  if (!user) {
    return <div>No user</div>;
  }
  const posts = await getUsersPosts(user.id);
  const settings = await getUserSettings(user.id);

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
          <p>{settings?.location}</p>
          {settings?.link ? (
            <a
              href={settings.link}
              className="text-sm text-sky-700 font-bold flex justify-start items-center"
            >
              <FaLink className="mr-1" />{" "}
              {settings.link.replace(/^https?:\/\//, "")}
            </a>
          ) : null}
          <p className="mt-1">"{settings?.bio}"</p>
        </div>
      </div>
      <ProfileMemories posts={posts} />
    </section>
  );
};

export default Profile;
