import React from "react";
import Image from "next/image";

const SimpleMemory = ({ img }: { img: string }) => {
  return (
    <Image
      src={img}
      alt="post"
      className="aspect-square object-cover w-full h-full"
      width={100}
      height={100}
    />
  );
};

export default SimpleMemory;
