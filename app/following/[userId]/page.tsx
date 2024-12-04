import UserCard from "@/components/UserCard";
import { getUserFollowing } from "@/useServer";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const UserId = async ({ params }: { params: { userId: string } }) => {
  const appUser = await currentUser();

  if (!appUser) {
    redirect("/");
  }

  const following = await getUserFollowing(params.userId, appUser.id);

  return (
    <section className="mt-20 px-5 overflow-y-auto">
      {following && following?.length < 1 ? (
        <div className="">You are not following anyone</div>
      ) : (
        following?.map((follow) => {
          if (!follow) {
            return;
          }
          return <UserCard card={follow} appUserId={appUser.id} />;
        })
      )}
    </section>
  );
};

export default UserId;
