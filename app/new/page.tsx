"use client";
import { uploadNewMemory } from "@/useServer";
import { useUser } from "@clerk/nextjs";
// import { Metadata } from "next";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { FaTrash } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";

// export const metadata: Metadata = {
//   title: "New Memory",
//   description: "Create a new memory to share with the world",
// };

const New = () => {
  const [images, setImages]: [File[], Dispatch<SetStateAction<File[]>>] =
    useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const createNewMemory = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (user) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("date", date);
      formData.append("userId", user.id);
      formData.append("desc", desc);
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
      const message = await uploadNewMemory(formData);
      if (message) {
        setLoading(false);
        router.push("/");
      }
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      setImages((prev): File[] => [...files, ...prev]);
    }
  };

  return (
    <main className="px-10 md:px-40 xl:px-60">
      <form
        onSubmit={createNewMemory}
        className="flex flex-col justify-center items-center mt-20"
      >
        <label htmlFor="images"></label>
        <div className="flex justify-start items-center gap-x-5 w-full overflow-x-auto mb-10 py-5">
          {images.length > 0
            ? images.map((image, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() =>
                      setImages((prev) => prev.filter((img) => img !== img))
                    }
                    className="absolute z-10 top-3 right-3 text-red-400 text-xl"
                  >
                    <FaTrash />
                  </button>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`${index}`}
                    className="object-cover w-80 min-w-80 max-w-80 min-h-80 max-h-80 h-80 rounded-lg shadow-md"
                  />
                </div>
              ))
            : null}
        </div>
        <div className="w-40 h-40 rounded-full bg-slate-300 flex justify-center items-center text-3xl relative">
          <LuImagePlus />
          <input
            type="file"
            name="images"
            id="images"
            onChange={handleFileUpload}
            placeholder="upload your images"
            className="opacity-0 absolute inset-0"
            accept="image/*"
            multiple
          />
        </div>
        <label htmlFor="title"></label>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your memory a title"
          className="px-5 py-3 shadow-lg rounded-sm mt-10 w-full focus:outline-none focus:border-none focus:bg-slate-100 duration-300 outline-none border-none"
        />
        <label htmlFor="location"></label>
        <input
          className="px-5 py-3 shadow-lg rounded-sm mt-3 w-full focus:outline-none focus:border-none focus:bg-slate-100 duration-300 outline-none border-none"
          type="text"
          onChange={(e) => setLocation(e.target.value)}
          name="location"
          placeholder="location"
        />
        <label htmlFor="date"></label>
        <input
          className="px-5 py-3 shadow-lg rounded-sm mb-10 mt-3 w-full focus:outline-none focus:border-none focus:bg-slate-100 duration-300 outline-none border-none"
          onChange={(e) => setDate(e.target.value)}
          type="date"
          name="date"
        />
        <textarea
          onChange={(e) => setDesc(e.target.value)}
          rows={10}
          placeholder="Give your memory a description"
          maxLength={300}
          className="px-5 py-3 shadow-lg rounded-sm mb-10 w-full focus:outline-none focus:border-none focus:bg-slate-100 duration-300 outline-none border-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="shadow-lg disabled:text-slate-400 rounded-sm w-full py-3 px-5 mb-10 focus:outline-none focus:border-none focus:bg-slate-100 duration-300 outline-none border-none"
        >
          Save
        </button>
      </form>
    </main>
  );
};

export default New;
