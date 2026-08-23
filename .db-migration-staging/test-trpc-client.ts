import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "./api/router";

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:58912/api/trpc",
      transformer: superjson,
    }),
  ],
});

async function main() {
  try {
    const res = await client.localAuth.login.mutate({
      username: "admin",
      password: "admin123",
    });
    console.log("Success:", res);
  } catch (err) {
    console.error("Error from TRPC:");
    console.error(err);
  }
}
main();
