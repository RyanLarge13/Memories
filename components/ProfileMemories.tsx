"use client";
import { Comment, LikedPhoto, Memory as MemoryInterface } from "@prisma/client";
import SimpleMemory from "@/components/SimpleMemory";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useRef,
} from "react";
import { FaEdit, FaHeart, FaTrash } from "react-icons/fa";
import { removePost } from "@/useServer";
import BackDrop from "./BackDrop";

interface Memory extends MemoryInterface {
  comments: Comment[];
  likes: LikedPhoto[];
}

type PostModal = {
  show: boolean;
  post: Memory | null;
};

const ProfileMemories = ({
  posts,
  children,
}: {
  posts: Memory[];
  children: React.ReactNode;
}) => {
  const [userFeed, setUserFeed] = useState(false);
  const [postModal, setPostModal]: [
    PostModal,
    Dispatch<SetStateAction<PostModal>>
  ] = useState<PostModal>({ show: false, post: null });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [indexToScrollTo, setIndexToScrollTo] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    console.log(`Index to scroll to: ${indexToScrollTo}`);
    if (sectionRef.current) {
      sectionRef.current.scrollTo({
        top: indexToScrollTo * 500,
        behavior: "smooth",
      });
    } else {
      console.log(`Index to scroll to: ${indexToScrollTo}`);
    }
  }, [indexToScrollTo]);

  useEffect(() => {
    const handleBack = (e: PopStateEvent) => {
      if (userFeed) {
        e.preventDefault();
        setUserFeed(false);
      }
      if (!userFeed) {
        return;
      }
    };
    window.addEventListener("popstate", handleBack);
    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [userFeed]);

  const closeOpenModal = () => {
    setPostModal({ show: false, post: null });
  };

  const deleteMemory = async (memoryId: string) => {
    try {
      await removePost(memoryId);
      setConfirmDelete(true);
      window.location.reload();
    } catch (err) {
      console.log("Failed to delete your post");
      console.log(err);
    }
  };

  return (
    <div className="mt-10">
      {confirmDelete ? (
        <div className="fixed top-5 right-5 left-5 rounded-md shadow-md p-2 z-40 bg-white">
          <p>Are you sure you want to delete this Memory?</p>
          <div className="flex justify-between items-center my-2">
            <button onClick={() => setConfirmDelete(false)}>Cancel</button>
            <button
              onClick={() => {
                if (postModal.post) {
                  deleteMemory(postModal.post.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ) : null}
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
          {posts.map((post, index) => (
            <button
              key={post.id}
              onContextMenu={(e) => {
                e.preventDefault();
                setPostModal({ show: true, post: post });
              }}
              onClick={() => {
                setIndexToScrollTo(index);
                setUserFeed(true);
              }}
            >
              <SimpleMemory
                key={post.id}
                img={post.imageUrls[post.coverIndex || 0]}
              />
            </button>
          ))}
        </div>
      )}
      {postModal.show && postModal.post !== null ? (
        <>
          <BackDrop setState={closeOpenModal} />
          <div className="fixed bottom-0 right-0 left-0 bg-white z-40 rounded-t-md p-3">
            <div className="flex justify-between items-center mb-2">
              <button onClick={() => {}}>
                <FaEdit />
              </button>
              <button
                className="text-red-400 p-2"
                onClick={() => {
                  if (postModal.post !== null) {
                    setConfirmDelete(true);
                  }
                }}
              >
                <FaTrash />
              </button>
            </div>
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
        <section
          ref={sectionRef}
          className="fixed inset-0 z-40 bg-white p-3 overflow-y-auto py-10"
        >
          {children}
        </section>
      ) : null}
    </div>
  );
};

export default ProfileMemories;
