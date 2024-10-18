import React from "react";
import Image from "next/image";

const SimpleMemory = ({ img }: { img: string }) => {
  return (
    <Image
      src={img}
      alt="post"
      className="aspect-square object-cover w-full h-full"
      width={500}
      height={500}
    />
  );
};

export default SimpleMemory;
