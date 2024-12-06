import Memories from "@/components/Memories";
import { getMemoriesByDate } from "@/useServer";
import React from "react";

const PostsByDate = async ({ params }: { params: { date: string } }) => {
  const posts = await getMemoriesByDate(decodeURIComponent(params.date));

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

export default PostsByDate;
