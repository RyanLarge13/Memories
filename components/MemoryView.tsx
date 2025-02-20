"use client";

import { useEffect, useRef, useState } from "react";
import { BiLoader } from "react-icons/bi";

import { getPosts } from "@/useServer";
import { Comment, LikedPhoto, Memory as MemoryInterface } from "@prisma/client";

import Memories from "./Memories";

interface Memory extends MemoryInterface {
  comments: Comment[];
  likes: LikedPhoto[];
}

const MemoryView = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);

  const loaderRef = useRef(null);

  // Function to fetch more memories
  const fetchMoreMemories = async (): Promise<void> => {
    if (loading || end) {
      return; // Prevent multiple fetches while already loading
    }

    setLoading(true);
    const newMemories = await getPosts(page);
    if (newMemories.end) {
      setEnd(true);
    }
    setPage((prev) => prev + 1);
    setMemories((prev) => [...prev, ...newMemories.memories]);
    setLoading(false);
  };

  // Set up the Intersection Observer once to detect when the loader is in view
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchMoreMemories(); // Only fetch if not already loading
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading]); // Only re-run when loading state changes

  return (
    <section className="flex max-w-[750px] flex-col basis-3/5 items-center justify-center min-h-screen">
      {memories.map((memory) => (
        <Memories key={memory.id} memory={memory} />
      ))}
      {!end ? (
        <div ref={loaderRef} className="mt-10">
          {loading ? <BiLoader className="animate-spin" /> : null}
        </div>
      ) : null}
    </section>
  );
};

export default MemoryView;
