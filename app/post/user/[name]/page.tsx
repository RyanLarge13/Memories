import Memories from "@/components/Memories";
import { getMemoriesByUser } from "@/useServer";
import React from "react";

const PostByUser = async ({ params }: { params: { name: string } }) => {
  const posts = await getMemoriesByUser(decodeURIComponent(params.name));

  if (!posts || posts.length < 1) {
    return (
      <section className="mt-20 px-5 overflow-y-auto">
        <p>No posts to show</p>
      </section>
    );
  }

  return (
    <section className="mt-20 px-5 overflow-y-auto">
      {posts.map((memory) => (
        <Memories key={memory.id} memory={memory} />
      ))}
    </section>
  );
};

export default PostByUser;
