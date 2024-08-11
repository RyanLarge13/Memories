import { PrismaClient } from "@prisma/client";
import Memories from "@/components/Memories";
const prisma = new PrismaClient();

const getPosts = async (pageNumber: number) => {
  "use server";
  const memories = await prisma.memory.findMany({
    orderBy: [{ createdAt: "desc" }],
    skip: pageNumber * 10,
    take: 10,
    include: { comments: true },
  });
  return memories;
};

const Home = async () => {
  const memories = await getPosts(0);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-20">
      {memories.length < 1 ? (
        <div>No memories</div>
      ) : (
        <section className="p-3">
          {memories.map((memory) => (
            <Memories key={memory.id} memory={memory} />
          ))}
        </section>
      )}
    </main>
  );
};

export default Home;