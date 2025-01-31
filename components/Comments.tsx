"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getUserFromClerk } from "@/useServer";
import { Comment } from "@prisma/client";

const Comments = ({ comments }: { comments: Comment[] }) => {
  const [users, setUsers] = useState<Map<string, any>>(new Map()); // Store user data by userId

  // Fetch user data for each comment
  useEffect(() => {
    const fetchUserData = async () => {
      const userMap = new Map();
      for (const comment of comments) {
        if (!userMap.has(comment.userId)) {
          const commentUser = await getUserFromClerk(comment.userId);
          userMap.set(comment.userId, commentUser);
        }
      }
      setUsers(userMap); // Update state with the fetched users
    };

    fetchUserData();
  }, [comments]);

  return (
    <div className="mt-3">
      {comments.map((comment: Comment) => {
        const commentUser = users.get(comment.userId); // Get user data from state

        return (
          <div key={comment.id} className="my-1">
            <Image
              src={commentUser?.img || ""}
              alt="user"
              width={20}
              height={20}
              className="w-8 h-8 rounded-full"
            />
            <p className="text-xs text-slate-600">@{commentUser?.name}</p>
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
