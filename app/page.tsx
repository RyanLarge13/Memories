import MemoryView from "@/components/MemoryView";
import MiniFollowing from "@/components/MiniFollowing";
import { getUserFollowersAndTopPost } from "@/useServer";
import { currentUser } from "@clerk/nextjs/server";

const Home = async () => {
  const user = await currentUser();

  if (!user) {
    return <p>Login Please</p>;
  }

  const following = await getUserFollowersAndTopPost(user.id);

  return (
    <main className="min-h-screen py-20 flex justify-center items-start">
      <div className="hidden lg:block basis-1/5 min-w-[25%] p-10 sticky top-20">
        <p className="text-lg font-semibold mb-5">Following</p>
        <div>
          {!following.users || following.users.length < 1 ? (
            <p>Follow someone new!</p>
          ) : (
            following.users.map((user) => (
              <MiniFollowing key={user.name} user={user} />
            ))
          )}
        </div>
      </div>
      <section className="flex max-w-[750px] flex-col lg:basis-3/5 items-center justify-center p-3">
        <MemoryView />
      </section>
      <div className="hidden basis-1/5 lg:block min-w-[25%] sticky top-20 p-10">
        <p className="text-lg font-semibold mb-5">What's New</p>
      </div>
    </main>
  );
};

export default Home;
