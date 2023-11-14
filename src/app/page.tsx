import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 ">
        <h1 className="text-2xl md:text-5xl font-semibold md:font-extrabold tracking-tight sm:text-[5rem] px-12 md:px-0 text-center">
          Create <span className="text-[hsl(280,100%,70%)]">Warunk</span> for your bussiness
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-y-2 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://warunk-chi.vercel.app/product/add"
          >
            <h3 className="text-xl md:text-2xl font-medium text-center md:text-left md:font-bold">First Steps →</h3>
            <div className="text-sm md:text-lg text-center md:text-left">
              Fill all field form to add Product.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-y-2 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://warunk-chi.vercel.app/product"
          >
            <h3 className="text-xl md:text-2xl font-medium text-center md:text-left md:font-bold">Your Product →</h3>
            <div className="text-sm md:text-lg text-center md:text-left">
              List of your product bussiness.
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-light no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
