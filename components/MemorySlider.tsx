"use client";
import { likeMemory, unlikeMemory } from "@/useServer";
import { useUser } from "@clerk/nextjs";
import { Comment, LikedPhoto, Memory as MemoryInterface } from "@prisma/client";
import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

interface Memory extends MemoryInterface {
  comments: Comment[];
  likes: LikedPhoto[];
}

const MemorySlider = ({ memory }: { memory: Memory }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedLoading, setLikedLoading] = useState(false);
  const [currentlyLiked, setCurrentlyLiked] = useState(false);

  const currentUser = useUser();
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser.user) {
      const hasLike = memory.likes.some(
        (like) => like.userId === currentUser?.user?.id
      );
      setCurrentlyLiked(hasLike);
    }
  }, [currentUser.user]);

  const likePhoto = async () => {
    setLikedLoading(true);
    if (currentUser.user) {
      const newLike = await likeMemory(currentUser.user.id, memory.id);
      setCurrentlyLiked(newLike);
    }
    setLikedLoading(false);
  };

  const unlikePhoto = async () => {
    setLikedLoading(true);
    if (currentUser.user) {
      const unlike = await unlikeMemory(currentUser.user.id, memory.id);
      setCurrentlyLiked(!unlike);
    }
    setLikedLoading(false);
  };

  return (
    <div
      ref={imageContainerRef}
      className="flex relative justify-start items-center overflow-hidden rounded-md shadow-lg"
    >
      {memory.imageUrls.length > 1 &&
      currentIndex !== memory.imageUrls.length - 1 ? (
        <div
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === memory.imageUrls.length - 1 ? prev : prev + 1
            )
          }
          className="absolute z-10 right-0 top-0 bottom-0 p-2 flex justify-center items-center bg-black opacity-0 hover:opacity-25 duration-300 hover:text-white text-xl font-bold rounded-md"
        >
          <FaArrowRight />
        </div>
      ) : null}
      {currentIndex > 0 ? (
        <div
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="absolute z-10 left-0 top-0 bottom-0 p-2 flex justify-center items-center bg-black opacity-0 hover:opacity-25 duration-300 hover:text-white text-xl font-bold rounded-md"
        >
          <FaArrowLeft />
        </div>
      ) : null}
      {currentlyLiked ? (
        <button
          disabled={likedLoading}
          onClick={() => unlikePhoto()}
          className="absolute top-3 left-3 disabled:text-slate-300 text-xl z-10 text-red-500 font-bold hover:text-red-400 duration-200"
        >
          <IoHeart />
        </button>
      ) : (
        <button
          disabled={likedLoading}
          onClick={() => likePhoto()}
          className="absolute top-3 left-3 disabled:text-slate-300 text-xl z-10 text-white font-bold hover:text-red-500 duration-200"
        >
          <IoHeartOutline />
        </button>
      )}
      {memory.imageUrls.map((url: string) => (
        <img
          key={url}
          src={url}
          alt={`${url}`}
          style={{
            transform: imageContainerRef.current
              ? `translateX(${-(
                  currentIndex *
                  imageContainerRef.current.getBoundingClientRect().width
                )}px)`
              : `none`,
          }}
          className="object-cover w-full h-full aspect-square rounded-lg shadow-md duration-300 select-none"
        />
      ))}
      <div className="absolute bottom-0 right-0 left-0 py-2 px-3 flex justify-start items-center gap-3">
        {memory.imageUrls.map((url: string, index: number) => (
          <div
            key={url}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-slate-700"
            } duration-300`}
          ></div>
        ))}
      </div>
      <p className="absolute font-bold right-2 bottom-1 z-10 text-white">
        {new Date(memory.when).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })}
      </p>
    </div>
  );
};

export default MemorySlider;
