import React from "react";

const BackDrop = ({ setState }: { setState: () => void }) => {
  return <div onClick={() => setState()} className="fixed z-20 inset-0"></div>;
};

export default BackDrop;
