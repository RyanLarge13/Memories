"use client";
import { Comment, Memory as MemoryInterface } from "@prisma/client";
import SimpleMemory from "@/components/SimpleMemory";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FaEdit, FaHeart, FaTrash } from "react-icons/fa";
import { removePost } from "@/useServer";
import BackDrop from "./BackDrop";

interface Memory extends MemoryInterface {
  comments: Comment[];
}

type PostModal = {
  show: boolean;
  post: Memory | null;
};

const ProfileMemories = ({ posts }: { posts: Memory[] }) => {
  const [userFeed, setUserFeed] = useState(false);
  const [postModal, setPostModal]: [
    PostModal,
    Dispatch<SetStateAction<PostModal>>
  ] = useState<PostModal>({ show: false, post: null });

  const closeOpenModal = () => {
    setPostModal({ show: false, post: null });
  };

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
            <button
              key={post.id}
              onContextMenu={() => setPostModal({ show: true, post: post })}
              onClick={() => setUserFeed(true)}
            >
              <SimpleMemory key={post.id} img={post.imageUrls[0]} />
            </button>
          ))}
        </div>
      )}
      {postModal.show && postModal.post !== null ? (
        <>
          <BackDrop setState={closeOpenModal} />
          <div className="fixed bottom-0 right-0 left-0 bg-white z-40 rounded-t-md p-3">
            <button
              onClick={() => {
                if (postModal.post !== null) {
                  removePost(postModal.post.id);
                }
              }}
            >
              <FaTrash />
            </button>
            <button onClick={() => {}}>
              <FaEdit />
            </button>
            <p className="text-lg mb-1">{postModal.post.title}</p>
            <p className="text-xs mb-2">{postModal.post.desc}</p>
            <div className="flex justify-between items-center">
              <p>
                Created On{" "}
                {new Date(postModal.post.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "short",
                  }
                )}
              </p>
              <p className="flex justify-items-center items-center gap-1">
                <FaHeart className="text-red-400" />{" "}
                {postModal.post.likes.length}
              </p>
            </div>
          </div>
        </>
      ) : null}
      {userFeed ? (
        <section className="fixed inset-0 z-40 bg-white">
          {posts.map((post) => (
            <>
              <div className="flex justify-end items-center">
                <button className="text-red-400">
                  <FaTrash />
                </button>
              </div>
              {/* <Memories key={post.id} memory={post} /> */}
              {/* Above component will need to change or restructuring will need to occur for client side /server side handling separation */}
            </>
          ))}
        </section>
      ) : null}
    </div>
  );
};

export default ProfileMemories;
