"use client";
import { followUser, unFollowUser } from "@/useServer";
import React, { useState } from "react";

const FollowBtn = ({
  following,
  userToFollow,
  currentUser,
}: {
  following: boolean;
  userToFollow: string;
  currentUser: string;
}) => {
  const [isFollowing, setIsFollowing] = useState(following);
  const [loading, setLoading] = useState(false);

  const followUnFollowUser = async () => {
    setLoading(true);
    if (isFollowing) {
      const unFollow: boolean = await unFollowUser(userToFollow, currentUser);
      if (unFollow) {
        setIsFollowing(false);
      }
    }
    if (!isFollowing) {
      const follow: boolean = await followUser(userToFollow, currentUser);
      if (follow) {
        setIsFollowing(true);
      }
    }
    setLoading(false);
  };

  return (
    <button
      disabled={loading}
      onClick={() => followUnFollowUser()}
      className={`w-[90%] text-center mt-3 py-1 rounded-md disabled:bg-slate-400 ${
        isFollowing ? "bg-sky-300" : "bg-green-300 shadow-md"
      }`}
    >
      {isFollowing ? "UnFollow" : "Follow"}
    </button>
  );
};

export default FollowBtn;
