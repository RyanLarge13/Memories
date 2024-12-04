import { getMemoryLikes } from "@/useServer";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import UserCard from "@/components/UserCard";

const MemoryId = async ({ params }: { params: { memoryId: string } }) => {
  const appUser = await currentUser();

  if (!appUser) {
    redirect("/");
  }

  const memoryLikes = await getMemoryLikes(params.memoryId, appUser.id);

  return (
    <section className="mt-20 px-5 overflow-y-auto">
      {memoryLikes.length < 1 ? (
        <div className="">No likes</div>
      ) : (
        memoryLikes.map((like) => {
          if (!like) {
            return;
          }
          return <UserCard card={like} appUserId={appUser.id} />;
        })
      )}
    </section>
  );
};

export default MemoryId;
