"use server";
import { PrismaClient } from "@prisma/client";
import { bucket } from "./lib/googleStorage";
import { clerkClient } from "@clerk/nextjs/server";
const prisma = new PrismaClient();

export const uploadNewMemory = async (data: FormData) => {
  const title = data.get("title") as string;
  const desc = data.get("desc") as string;
  const userId = data.get("userId") as string;
  const date = data.get("date") as string;
  const location = data.get("location") as string;
  const fileUrls: string[] = [];
  for (const [key, value] of data.entries()) {
    if (value instanceof File) {
      const file = value as File;
      const fileName = file.name;
      const fileUpload = bucket.file(fileName);
      try {
        await new Promise<void>(async (resolve, reject) => {
          const stream = fileUpload.createWriteStream({
            metadata: {
              contentType: file.type,
            },
          });
          stream.on("error", (err) => {
            console.error("Error uploading file:", err);
            reject(err);
          });
          stream.on("finish", async () => {
            try {
              await fileUpload.makePublic();
              const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
              fileUrls.push(fileUrl);
              resolve();
            } catch (err) {
              console.error("Error making file public:", err);
              reject(err);
            }
          });

          stream.end(Buffer.from(await file.arrayBuffer()));
        });
      } catch (err) {
        console.error("Error handling file:", err);
      }
    }
  }
  try {
    await prisma.memory.create({
      data: {
        userId,
        title,
        desc,
        when: new Date(date) || new Date(),
        location: location,
        imageUrls: {
          set: fileUrls,
        },
      },
    });
  } catch (err) {
    console.error("Error creating memory record:", err);
  }
  return { message: "Files uploaded successfully" };
};

export const deleteMemory = async (data: FormData) => {
  const memoryId = data.get("memoryId") as String;
  const userId = data.get("userId") as String;
  const imageUrls = data.get("urls") as String;
  console.log(imageUrls);
};

export const removePost = async (postId: string) => {};

export const postNewComment = async (
  userId: string | undefined,
  memoryId: string,
  comment: string
) => {
  if (userId) {
    const user = await getUserFromClerk(userId);
    if (user) {
      const newComment = await prisma.comment.create({
        data: { userId, memoryId, text: comment },
      });
      if (newComment) {
        return newComment;
      }
    }
  }
};

export const getUserFromClerk = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);
  if (user) {
    return { img: user.imageUrl, name: `${user.firstName}${user.lastName}` };
  } else {
    return null;
  }
};

export const getUsersPosts = async (userId: string) => {
  const usersPosts = await prisma.memory.findMany({
    where: { userId: userId },
  });
  return usersPosts;
};

export const getSinglePost = async (postId: string, userId: string) => {
  const post = await prisma.memory.findUnique({ where: { id: postId } });
  const user = await getUserFromClerk(userId);
  return { post: post, user: user };
};
