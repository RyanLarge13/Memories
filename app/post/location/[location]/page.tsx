import Memories from "@/components/Memories";
import { getMemoriesByLocation } from "@/useServer";
import { Metadata } from "next";
import React from "react";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Locations",
    description: "Search the worlds memories near you!",
  };
};

const PostLocation = async ({ params }: { params: { location: string } }) => {
  const posts = await getMemoriesByLocation(
    decodeURIComponent(params.location)
  );

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

export default PostLocation;
