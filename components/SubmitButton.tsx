"use client";
import React from "react";
import { useFormStatus } from "react-dom";

const SubmitButton = ({ text }: { text: string }) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="disabled:text-slate-400 py-3 px-4"
    >
      {pending ? "Sending" : text}
    </button>
  );
};

export default SubmitButton;
