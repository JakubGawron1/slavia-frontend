import { Hero } from "@/components/Hero";
import { HomeSections } from "@/components/HomeSections";
import { listPublicFlags } from "@/lib/api/generated/default/default";
import { isFlagEnabled } from "@/lib/public-flags";
import type { PublicFlag } from "@/lib/api/generated/models";

async function fetchPublicFlags(): Promise<PublicFlag[] | undefined> {
  try {
    const result = await listPublicFlags();
    return result.data;
  } catch {
    return undefined;
  }
}

export default async function Home() {
  const flags = await fetchPublicFlags();
  const blogEnabled = isFlagEnabled(flags, "public_blog");
  const ogloszeniaEnabled = isFlagEnabled(flags, "announcements_board");

  return (
    <>
      <Hero blogEnabled={blogEnabled} />
      <HomeSections
        blogEnabled={blogEnabled}
        ogloszeniaEnabled={ogloszeniaEnabled}
      />
    </>
  );
}
