import { LoadingScene } from "@/components/loading/LoadingScene";

export default function SiteLoading() {
  return (
    <LoadingScene
      variant="section"
      label="Ładowanie"
      hint="Przygotowujemy pomost…"
    />
  );
}
