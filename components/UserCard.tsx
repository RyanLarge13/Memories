import Image from "next/image";
import React from "react";
import FollowBtn from "./FollowBtn";

const UserCard = ({
  card,
  appUserId,
}: {
  card: {
    img: string | null | undefined;
    username: string | null | undefined;
    title: string | null | undefined;
    id: string | null | undefined;
    isFollowing: boolean | null | undefined;
  };
  appUserId: string;
}) => {
  return (
    <div key={card?.id} className="rounded-sm shadow-md p-3 my-2">
      <a
        href={`user/${card.id}`}
        className="flex justify-between items-center gap-x-3"
      >
        <Image
          src={card?.img || ""}
          alt="user"
          width={30}
          height={30}
          className="rounded-full shadow-md object-cover"
        />
        <div className="text-left w-full">
          <p>{card?.username}</p>
          <p className="text-gray-400">{card?.title}</p>
        </div>
        <div className="flex-[30%]">
          {appUserId !== card.id ? (
            <FollowBtn
              following={card?.isFollowing || false}
              userToFollow={card?.id || ""}
              currentUser={card.id || ""}
            />
          ) : null}
        </div>
      </a>
    </div>
  );
};

export default UserCard;
