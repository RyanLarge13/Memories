"use client";
import React, { useState } from "react";

const FollowBtn = ({ following }: { following: boolean }) => {
  const [isFollowing, setIsFollowing] = useState(following);

  const followUnFollowUser = () => {};

  return (
    <button
      onClick={() => followUnFollowUser()}
      className={`w-[90%] text-center py-1 rounded-md ${
        isFollowing ? "bg-sky-300" : "bg-green-300 shadow-md"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowBtn;
