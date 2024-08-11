import { getUserFromClerk } from "@/useServer";
import { currentUser } from "@clerk/nextjs/server";
import { Comment } from "@prisma/client";
import Image from "next/image";
import React from "react";

const Comments = async ({ comments }: { comments: Comment[] }) => {
  const user = await currentUser();

  if (!user) {
    return;
  }

  return (
    <div className="mt-3">
      {comments.map(async (comment: Comment) => {
        const commentUser = await getUserFromClerk(comment.userId);
        if (!commentUser) {
          return;
        }
        return (
          <div key={comment.id} className="my-1">
            <Image
              src={commentUser.img}
              alt="user"
              width={20}
              height={20}
              className="w-8 h-8 rounded-full"
            />
            <p className="text-xs text-slate-600">@{commentUser.name}</p>
            <p className="text-xs font-semibold">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}
            </p>
            <p className="text-sm">{comment.text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
