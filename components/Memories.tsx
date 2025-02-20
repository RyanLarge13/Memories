"use client";

import { useEffect, useState } from "react";
import { FaLocationPin } from "react-icons/fa6";

import MemorySlider from "@/components/MemorySlider";
import NewComments from "@/components/NewComments";
import { getUserFromClerk } from "@/useServer";
import { Comment, LikedPhoto, Memory as MemoryInterface } from "@prisma/client";

import Comments from "./Comments";

interface Memory extends MemoryInterface {
  comments: Comment[];
  likes: LikedPhoto[];
}

const Memories = ({ memory }: { memory: Memory; index?: number }) => {
  const [postUser, setPostUser] = useState<{
    img: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    getPostUser();
  }, []);

  const getPostUser = async () => {
    const user = await getUserFromClerk(memory.userId);
    setPostUser(user);
  };

  return (
    <div className="my-5 w-full">
      <div className="px-3">
        <a
          href={`/user/${memory.userId}`}
          className="flex justify-between items-center mb-5"
        >
          <p className="font-semibold">@{postUser?.name}</p>
          <img
            src={postUser?.img || ""}
            alt="user"
            className="w-7 h-7 rounded-full object-contain select-none"
          />
        </a>
      </div>
      <MemorySlider memory={memory} />
      <div className="px-3">
        <div className="mt-2 flex justify-between items-center ga-x-10">
          <p className="text-slate-800 text-lg">{memory.title}</p>
          <a href={`/likes/${memory.id}`}>
            <span className="font-bold">{memory.likes.length}</span>{" "}
            {memory.likes.length === 1 ? "like" : "likes"}
          </a>
        </div>
        {memory.location ? (
          <a
            href={`/post/location/${memory.location}`}
            className="mt-1 text-xs flex justify-start items-start gap-x-1"
          >
            <FaLocationPin /> <p>{memory.location}</p>
          </a>
        ) : null}
        <p className="text-xs mb-1 text-gray-400 font-semibold">
          Posted on:{" "}
          {new Date(memory.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          })}
        </p>
        <p className="text-slate-500">{memory.desc}</p>
        <a
          href={`/post/date/${memory.when}`}
          className="text-sm font-semibold my-2 block"
        >
          {new Date(memory.when).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          })}
        </a>
        <Comments comments={memory.comments} />
        <NewComments memoryId={memory.id} />
      </div>
    </div>
  );
};

export default Memories;
