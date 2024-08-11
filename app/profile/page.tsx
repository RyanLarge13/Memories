import ProfileMemories from "@/components/ProfileMemories";
import { getUsersPosts } from "@/useServer";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";

const Profile = async () => {
  const user = await currentUser();
  if (!user) {
    return <div>No user</div>;
  }
  const posts = await getUsersPosts(user.id);

  return (
    <section className="pt-20">
      <div className="px-5">
        <h1 className="text-2xl mb-1 font-semibold">{`${user.firstName}${user.lastName}`}</h1>
        <Image
          src={user.imageUrl}
          alt="user"
          width={40}
          height={40}
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>
      <ProfileMemories posts={posts} />
    </section>
  );
};

export default Profile;
