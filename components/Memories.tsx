import React from "react";
import { getUserFromClerk } from "@/useServer";
import { Comment, Memory as MemoryInterface } from "@prisma/client";
import { FaLocationPin } from "react-icons/fa6";
import Comments from "@/components/Comments";
import MemorySlider from "@/components/MemorySlider";
import NewComments from "@/components/NewComments";

interface Memory extends MemoryInterface {
  comments: Comment[];
}

const Memories = async ({ memory }: { memory: Memory }) => {
  const postUser = await getUserFromClerk(memory.userId);

  return (
    <div className="my-5 w-full">
      <a
        href={`/user/${memory.userId}`}
        className="flex justify-between items-center mb-5"
      >
        <p className="font-semibold">@{postUser?.name}</p>
        <img
          src={postUser?.img}
          alt="user"
          className="w-7 h-7 rounded-full object-contain select-none"
        />
      </a>
      <MemorySlider memory={memory} />
      <p className="text-slate-800 text-lg mt-2">{memory.title}</p>
      {memory.location ? (
        <div className="mt-1 text-xs flex justify-start items-start gap-x-1">
          <FaLocationPin /> <p>{memory.location}</p>
        </div>
      ) : null}
      <p className="text-slate-500">{memory.desc}</p>
      <p className="text-sm font-semibold mt-2">
        {new Date(memory.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })}
      </p>
      <Comments comments={memory.comments} />
      <NewComments memoryId={memory.id} />
    </div>
  );
};

export default Memories;
