import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink, splitLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import type { AppRouter } from "../../server/router";
import type { ReactNode } from "react";

export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient({ defaultOptions: { queries: {
  staleTime: 60_000, gcTime: 600_000, refetchOnWindowFocus: false, retry: 1,
} } });
const publicPaths = new Set(["project.list", "project.bySlug", "blog.list", "blog.bySlug"]);
const createBatchLink = () => httpBatchLink({
  url: "/api/trpc", transformer: superjson,
  fetch(input, init) { return globalThis.fetch(input, { ...(init ?? {}), credentials: "include" }); },
});
const trpcClient = trpc.createClient({
  links: [
    splitLink({ condition: op => publicPaths.has(op.path), true: createBatchLink(), false: createBatchLink() }),
  ],
});

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
