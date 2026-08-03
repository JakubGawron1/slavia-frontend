import { LoadingScene } from "@/components/loading/LoadingScene";

export default function KlubLoading() {
  return (
    <LoadingScene
      variant="inline"
      label="Panel klubowy"
      hint="Ładujemy dane klubu…"
    />
  );
}