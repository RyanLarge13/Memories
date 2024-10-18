"use client";
import { postNewComment } from "@/useServer";
import { useUser } from "@clerk/nextjs";
import { Comment } from "@prisma/client";
import React, { SetStateAction, useState, Dispatch } from "react";

const NewComments = ({ memoryId }: { memoryId: string }) => {
  const [newComments, setNewComments]: [
    Comment[],
    Dispatch<SetStateAction<Comment[]>>
  ] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useUser().user;

  const postComment = async () => {
    setLoading(true);
    if (!newCommentText || newCommentText === "") {
      setNewCommentText("");
      setLoading(false);
      return;
    }
    if (user) {
      const newComment = await postNewComment(
        user.id,
        memoryId,
        newCommentText
      );
      if (newComment) {
        setLoading(false);
        setNewCommentText("");
        setNewComments((prev: Comment[]) => [...prev, newComment]);
      }
    }
    setLoading(false);
  };

  return (
    <>
      {user
        ? newComments.map((comment: Comment) => (
            <div key={comment.id} className="my-1">
              <img
                src={user.imageUrl}
                alt="user"
                width={20}
                height={20}
                className="w-8 h-8 rounded-full"
              />
              <p className="text-xs text-slate-600">
                @{`${user.firstName}${user.lastName}`}
              </p>
              <p className="text-xs font-semibold">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
              <p className="text-sm">{comment.text}</p>
            </div>
          ))
        : null}
      <div className="flex justify-start items-center">
        <input
          type="text"
          onChange={(e) => setNewCommentText(e.target.value)}
          className="bg-transparent py-2 px-1 outline-none focus:outline-none w-full"
          placeholder="comment"
        />
        <button
          disabled={loading}
          onClick={() => postComment()}
          className="px-1 py-2 bg-transparent disabled:text-slate-300 duration-200"
        >
          send
        </button>
      </div>
    </>
  );
};

export default NewComments;
