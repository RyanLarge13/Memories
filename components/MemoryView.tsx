"use client";

import { useEffect, useRef, useState } from "react";
import { BiLoader } from "react-icons/bi";

import { getPosts } from "@/useServer";

import Memories from "./Memories";

const MemoryView = () => {
  const [memories, setMemories] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);

  // Function to fetch more memories
  const fetchMoreMemories = async (): Promise<void> => {
    if (loading) {
      return; // Prevent multiple fetches while already loading
    }

    setLoading(true);
    console.log("calling");
    const newMemories = await getPosts(page);
    setPage((prev) => prev + 1);
    setMemories((prev) => [...prev, ...newMemories]);
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
    <section className="flex max-w-[750px] flex-col basis-3/5 items-center justify-center p-3 min-h-screen">
      {memories.map((memory) => (
        <Memories key={memory.id} memory={memory} />
      ))}
      <div ref={loaderRef} className="mt-10">
        {loading ? <BiLoader className="animate-spin" /> : null}
      </div>
    </section>
  );
};

export default MemoryView;
