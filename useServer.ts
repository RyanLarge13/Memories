"use server";
import { PrismaClient } from "@prisma/client";
import { bucket } from "./lib/googleStorage";
import { auth, clerkClient } from "@clerk/nextjs/server";
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
    include: { comments: true },
  });
  return usersPosts;
};

export const getSinglePost = async (postId: string, userId: string) => {
  const post = await prisma.memory.findUnique({ where: { id: postId } });
  const user = await getUserFromClerk(userId);
  return { post: post, user: user };
};

export const getUserSettings = async (userId: string) => {
  if (!userId) {
    return null;
  }
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId },
  });
  if (!userSettings) {
    return null;
  }
  return userSettings;
};

const createUserSettings = async (data: {
  userId: string;
  location: string | null;
  title: string | null;
  bio: string | null;
  link: string | null;
  followers: string[];
  following: string[];
}) => {
  const newSettings = await prisma.userSettings.create({ data: data });
  return newSettings;
};

export const createDefaultSettings = async (userId: string) => {
  const newSettings = await prisma.userSettings.create({
    data: { userId: userId },
  });
  return newSettings;
};

export const updateSettings = async (data: FormData) => {
  const username = data.get("username") as string;
  if (username) {
    // update clerk
  }
  const allFormData = {
    userId: data.get("id") as string,
    location: data.get("location") as string | null,
    title: data.get("title") as string | null,
    bio: data.get("bio") as string | null,
    link: data.get("link") as string | null,
    following: [] as string[],
    followers: [] as string[],
  };
  const userSettings = await getUserSettings(allFormData.userId);
  if (!userSettings) {
    const newSettings = await createUserSettings(allFormData);
    if (!newSettings) {
      return null;
    }
  }
  if (userSettings) {
    const updatedSettings = await prisma.userSettings.update({
      where: { id: userSettings.id },
      data: {
        location: allFormData.location
          ? allFormData.location
          : userSettings.location,
        title: allFormData.title ? allFormData.title : userSettings.title,
        bio: allFormData.bio ? allFormData.bio : userSettings.bio,
        link: allFormData.link ? allFormData.link : userSettings.link,
      },
    });
    if (updatedSettings) {
      return updatedSettings;
    } else {
      return null;
    }
  }
};

export const followUser = async (userToFollow: string, currentUser: string) => {
  const update = await prisma.userSettings.update({
    where: { userId: userToFollow },
    data: { followers: { push: currentUser } },
  });
  const otherUpdate = await prisma.userSettings.update({
    where: { userId: currentUser },
    data: { following: { push: userToFollow } },
  });
  if (!update || !otherUpdate) {
    return false;
  }
  return true;
};

export const unFollowUser = async (
  userToFollow: string,
  currentUser: string
) => {
  const user = await prisma.userSettings.findUnique({
    where: { userId: userToFollow },
  });
  if (!user) {
    return false;
  }
  const newFollowers = user.followers.filter(
    (follow) => follow !== currentUser
  );
  const update = await prisma.userSettings.update({
    where: { userId: userToFollow },
    data: { followers: newFollowers },
  });
  if (!update) {
    return false;
  }
  const otherUser = await prisma.userSettings.findUnique({
    where: { userId: currentUser },
  });
  if (!otherUser) {
    return false;
  }
  const newFollowing = otherUser.following.filter(
    (follow) => follow !== userToFollow
  );
  const otherUserUpdate = await prisma.userSettings.update({
    where: { userId: currentUser },
    data: { following: newFollowing },
  });
  if (!otherUserUpdate) {
    return false;
  }
  return true;
};

export const getLikedPhotos = async (userId: string) => {
  const likedPhotos = await prisma.likedPhoto.findMany({ where: { userId } });
  return likedPhotos;
};

export const likeMemory = async (userId: string, memoryId: string) => {
  const alreadyLiked = await prisma.likedPhoto.findFirst({
    where: { userId, memoryId },
  });
  const userExists = await prisma.userSettings.findUnique({
    where: { userId },
  });
  if (!userExists) {
    console.log("No user settings exist");
    return false;
  }
  if (alreadyLiked) {
    return false;
  }
  const likedPhoto = await prisma.likedPhoto.create({
    data: { userId, memoryId },
  });
  if (!likedPhoto) {
    return false;
  }
  return true;
};

export const unlikeMemory = async (userId: string, memoryId: string) => {
  const hasLiked = await prisma.likedPhoto.findFirst({
    where: { userId, memoryId },
  });
  if (!hasLiked) {
    return false;
  }
  const unLikedPhoto = await prisma.likedPhoto.delete({
    where: { id: hasLiked.id },
  });
  if (!unLikedPhoto) {
    return false;
  }
  return true;
};

export const deleteAccount = async () => {
  const { userId } = auth();
  if (!userId) {
    return false;
  }
  await clerkClient.users.deleteUser(userId);
  await prisma.userSettings.delete({ where: { userId } });
  await prisma.comment.deleteMany({ where: { userId } });
  await prisma.memory.deleteMany({ where: { userId } });
  return true;
};
