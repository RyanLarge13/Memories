import SubmitButton from "@/components/SubmitButton";
import { deleteAccount } from "@/useServer";
import React from "react";

const DeleteAccount = () => {
  return (
    <section className="pt-20 px-10 flex flex-col justify-center items-center h-screen">
      <h2 className="text-xl text-center">
        Are you sure you want to delete your account? We hate to see you go
      </h2>
      <div className="flex justify-between items-center mt-40 w-full px-5">
        <form action={deleteAccount} className="flex-1">
          <SubmitButton text="Delete Account" styles="text-red-400" />
        </form>
        <a href="/profile" className="text-green-500 flex-1 text-center">
          Cancel
        </a>
      </div>
    </section>
  );
};

export default DeleteAccount;

// client version of component
/* 
"use client"
import { deleteAccount } from "@/useServer";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const DeleteAccount = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  return (
    <section className="pt-20 px-10 flex flex-col justify-center items-center h-screen">
      <h2 className="text-xl text-center">
        Are you sure you want to delete your account? We hate to see you go
      </h2>
      <div className="flex justify-between items-center mt-40 w-full px-5">
        <button
          disabled={loading}
          className="text-red-400 disabled:text-slate-400"
          onClick={async () => {
            setLoading(true);
            await deleteAccount();
            setLoading(false);
            router.push("/");
          }}
        >
          Delete Account
        </button>
        <a href="/profile" className="text-green-500 flex-1 text-center">
          Cancel
        </a>
      </div>
    </section>
  );
};

export default DeleteAccount;
*/
