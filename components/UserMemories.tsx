import { Comment, Memory as MemoryInterface } from "@prisma/client";
import SimpleMemory from "@/components/SimpleMemory";
import React from "react";

interface Memory extends MemoryInterface {
  comments: Comment[];
}

const UserMemories = ({ posts }: { posts: Memory[] }) => {
  return (
    <div className="mt-10">
      {posts.length < 1 ? (
        <div className="flex flex-col justify-center items-center">
          <p className="text-lg font-semibold">No posts to show!</p>
          <a
            href="/new"
            className="mt-10 bg-slate-400 w-10 h-10 p-2 text-center flex justify-center items-center rounded-full"
          >
            +
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {posts.map((post) => (
            <div key={post.id}>
              <SimpleMemory key={post.id} img={post.imageUrls[0]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserMemories;
