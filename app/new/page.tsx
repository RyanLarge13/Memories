"use client";
import { uploadNewMemory } from "@/useServer";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import { LuImagePlus } from "react-icons/lu";
import imageCompression from "browser-image-compression";
import StaticSlider from "@/components/StaticSlider";
import Validator from "@/lib/validator";

const New = () => {
  const [images, setImages]: [File[], Dispatch<SetStateAction<File[]>>] =
    useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);

  const { user } = useUser();
  const router = useRouter();

  const createNewMemory = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateFormData()) {
      return;
    }
    setLoading(true);
    if (user) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("date", date);
      formData.append("userId", user.id);
      formData.append("desc", desc);
      formData.append("cover-index", coverIndex.toString());
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
      const message = await uploadNewMemory(formData);
      if (message) {
        console.log(message.message);
        (document.getElementById("images") as HTMLInputElement).value = "";
        setImages([]);
        setLoading(false);
        router.push("/");
      }
      if (message.err) {
        console.log("Error uploading from the server!");
        console.log(message.message);
      }
      (document.getElementById("images") as HTMLInputElement).value = "";
      setImages([]);
    }
  };

  const validateFormData = (): boolean => {
    const validator = new Validator();

    // valStr method params
    // string, minLength, maxLength, customRegex, customEscapeMap
    if (!validator.valStr(title, 3, 35)) {
      return false;
    }
    if (!validator.valStr(desc, 3, 250)) {
      return false;
    }
    if (!validator.valStr(location, 3, 100)) {
      return false;
    }
    // valInt validation params: number, testLength, minSize, maxSize, customRegex
    if (!validator.valInt(coverIndex, false)) {
      return false;
    }

    return false;
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      try {
        const compressedFiles = await Promise.all(
          files.map(async (aFile) => {
            const compressedFile = await imageCompression(aFile, {
              maxSizeMB: 1,
            });
            return new File([compressedFile], aFile.name, { type: aFile.type });
          })
        );
        setImages((prev): File[] => [...compressedFiles, ...prev]);
      } catch (err) {
        console.log(`Could not compress images. Error: ${err}`);
      }
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
          <StaticSlider
            images={images}
            setImages={setImages}
            coverIndex={coverIndex}
            setCoverIndex={setCoverIndex}
          />
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
