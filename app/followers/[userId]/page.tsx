import UserCard from "@/components/UserCard";
import { getUserFollowers } from "@/useServer";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const UserId = async ({ params }: { params: { userId: string } }) => {
  const appUser = await currentUser();

  if (!appUser) {
    redirect("/");
  }

  const followers = await getUserFollowers(params.userId, appUser.id);

  return (
    <section className="mt-20 px-5 overflow-y-auto">
      {followers && followers?.length < 1 ? (
        <div className="">No Followers</div>
      ) : (
        followers?.map((follower) => {
          if (!follower) {
            return;
          }
          return <UserCard card={follower} appUserId={appUser.id} />;
        })
      )}
    </section>
  );
};

export default UserId;
