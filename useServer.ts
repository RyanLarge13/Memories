"use server";
import { Memory, PrismaClient } from "@prisma/client";
import { bucket } from "./lib/googleStorage";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
const prisma = new PrismaClient();

export const uploadNewMemory = async (data: FormData) => {
  try {
    const title = data.get("title") as string;
    const desc = data.get("desc") as string;
    const userId = data.get("userId") as string;
    const date = data.get("date") as string;
    const location = data.get("location") as string;
    const coverIndex = data.get("cover-index") as string;
    const fileUrls: string[] = [];
    for (const [_, value] of data.entries()) {
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
              revalidatePath("/new");
              return {
                message: `Error uploading image to bucket \n// ${err}`,
                err: true,
              };
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
          revalidatePath("/new");
          return { message: `Error with handling file \n// ${err}`, err: true };
        }
      }
    }
    try {
      const newMemory = await prisma.memory.create({
        data: {
          userId,
          title,
          desc,
          coverIndex: Number(coverIndex),
          when: new Date(date) || new Date(),
          location: location,
          imageUrls: {
            set: fileUrls,
          },
        },
      });
      if (!newMemory) {
        console.log("No new memory, failed to insert new memory in prisma");
        revalidatePath("/new");
        return {
          message: "Memory failed to insert to prisma DB \n// no info",
          err: true,
        };
      }
      revalidatePath("/new");
      return { message: "New memory uploaded successfully", err: false };
    } catch (err) {
      console.error("Error creating memory record:", err);
      revalidatePath("/new");
      return {
        message: `Could not connect to the server, please try again \n// ${err}`,
        err: true,
      };
    }
  } catch (err) {
    console.log(err);
    return { message: `Failed to upload memory \n// ${err}`, err: true };
  }
};

const deleteImages = async (imageUrls: string[]) => {
  try {
    const deleteAllImages = imageUrls.map((img) => {
      const fileName = img.split("/").pop();
      if (!fileName) {
        return new Promise((_, rej) => rej());
      }
      const file = bucket.file(fileName);
      return file.delete();
    });
    await Promise.all(deleteAllImages);
  } catch (err) {
    console.log(`Error deleting images: ${err}`);
  }
};

export const removePost = async (postId: string) => {
  const memory = await prisma.memory.findUnique({ where: { id: postId } });
  const user = await currentUser();
  if (!memory) {
    return {
      message: "Deleting your Memory failed, there is no Memory to delete",
      success: false,
    };
  }
  if (!user) {
    return {
      message: "You need to sign in before you can delete this Memory",
      success: false,
    };
  }
  if (memory.userId !== user.id) {
    return {
      message: "You are not authorized to delete this Memory",
      success: false,
    };
  }
  const imageUrls = memory.imageUrls;
  try {
    await deleteImages(imageUrls);
  } catch (err) {
    console.log(`Error deleting all images ${err}`);
    return { message: "failed to delete your images", success: false };
  }
  const deletedMemory = await prisma.memory.delete({ where: { id: postId } });
  if (!deletedMemory) {
    return { message: "Failed to delete your Memory", success: false };
  }
  return { message: "Successfully deleted your Memory", success: true };
};

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

export const getUserFollowersAndTopPost = async (userId: string) => {
  const currentUserInfo = await prisma.userSettings.findUnique({
    where: { userId: userId },
  });

  const following: string[] | undefined = currentUserInfo?.following;

  if (!following || following.length < 1) {
    return { message: "Not following anyone" };
  }

  let followersArray = [];

  for (let i = 0; i < 10; i++) {
    if (!following[i]) {
      continue;
    }
    const userInfo = await clerkClient.users.getUser(following[i]);

    const sendableData: { img: string; name: string; latest: null | Memory } = {
      img: userInfo.imageUrl,
      name: `@${userInfo.firstName}${userInfo.lastName}`,
      latest: null,
    };

    const latestPost = await prisma.memory.findFirst({
      where: { userId: userInfo.id },
      orderBy: { createdAt: "desc" },
    });

    sendableData.latest = latestPost;

    followersArray.push(sendableData);
  }

  return { message: "Success", users: followersArray };
};

export const getUsersPosts = async (userId: string) => {
  const usersPosts = await prisma.memory.findMany({
    where: { userId: userId },
    include: { comments: true, likes: true },
    orderBy: { createdAt: "desc" },
  });
  return usersPosts;
};

export const getSinglePost = async (postId: string, userId: string) => {
  const post = await prisma.memory.findUnique({
    where: { id: postId },
    include: { comments: true, likes: true },
  });
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
    await createUserSettings(allFormData);
  }
  if (userSettings) {
    await prisma.userSettings.update({
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

export const getUserFollowers = async (userId: string, appUserId: string) => {
  const userInfo = await prisma.userSettings.findUnique({ where: { userId } });
  const followers = userInfo?.followers;

  if (!followers) {
    return;
  }

  const userFollowers = await Promise.all(
    followers.map(async (follower) => {
      const followerUser = await prisma.userSettings.findUnique({
        where: { userId: follower },
      });
      const clerkFollowerUser = await getUserFromClerk(follower);
      return {
        img: clerkFollowerUser?.img || "",
        username: clerkFollowerUser?.name || "",
        title: followerUser?.title,
        id: follower,
        isFollowing: followerUser?.following.includes(appUserId),
      };
    })
  );

  return userFollowers;
};

export const getUserFollowing = async (userId: string, appUserId: string) => {
  const userInfo = await prisma.userSettings.findUnique({ where: { userId } });
  const following = userInfo?.following;

  if (!following) {
    return;
  }

  const userFollowing = await Promise.all(
    following.map(async (following) => {
      const followingUser = await prisma.userSettings.findUnique({
        where: { userId: following },
      });
      const clerkFollowingUser = await getUserFromClerk(following);
      return {
        img: clerkFollowingUser?.img || "",
        username: clerkFollowingUser?.name || "",
        title: followingUser?.title,
        id: following,
        isFollowing: followingUser?.followers.includes(appUserId),
      };
    })
  );

  return userFollowing;
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

const removeAllImages = async (userId: string) => {
  const memories = await prisma.memory.findMany({ where: { userId } });
  if (!memories) {
    return false;
  }
  const imageUrls = memories.flatMap((mem) => mem.imageUrls);
  try {
    await deleteImages(imageUrls);
    return true;
  } catch (err) {
    console.log(`Error deleting your images: ${err}`);
    return false;
  }
};

export const deleteAccount = async () => {
  const { userId } = auth();
  if (!userId) {
    return;
  }
  const removedImages = await removeAllImages(userId);
  if (!removedImages) {
    return;
  }
  await clerkClient.users.deleteUser(userId);
  await prisma.userSettings.delete({ where: { userId } });
  await prisma.comment.deleteMany({ where: { userId } });
  await prisma.memory.deleteMany({ where: { userId } });
  return;
};

export const getMemoryLikes = async (memoryId: string, userId: string) => {
  const usersWhoLiked = await prisma.likedPhoto.findMany({
    where: { memoryId },
    include: { user: true },
  });

  const currentDbUser = await prisma.userSettings.findUnique({
    where: { userId },
  });

  const userFields = await Promise.all(
    usersWhoLiked.map(async (user) => {
      const clerkUser = await getUserFromClerk(user.userId);
      return {
        img: clerkUser?.img || "",
        username: clerkUser?.name || "",
        title: user.user.title,
        id: user.userId,
        isFollowing: currentDbUser?.following.includes(user.userId),
      };
    })
  );

  return userFields;
};
