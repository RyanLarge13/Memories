import { Memory } from "@prisma/client";
import React from "react";

const MiniFollowing = ({
  user,
}: {
  user: { img: string; name: string; latest: null | Memory };
}) => {
  return (
    <div className="p-5 rounded-sm my-3">
      <div className="flex justify-start items-end gap-x-2 mb-3">
        <img
          src={user.img}
          className="rounded-full w-[30px] h-[30px] shadow-md"
        />
        <p>{user.name}</p>
      </div>
      <p>Latest Post From {user.name}</p>
      <div className="max-w-30 aspect-square overflow-hidden rounded-md">
        <img
          src={user.latest?.imageUrls[0]}
          alt="first post"
          className="object-cover w-full h-full"
        />
      </div>
      <p>{user.latest?.desc}</p>
    </div>
  );
};

export default MiniFollowing;
