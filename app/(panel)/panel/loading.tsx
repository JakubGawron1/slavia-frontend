import { LoadingScene } from "@/components/loading/LoadingScene";

export default function PanelLoading() {
  return (
    <LoadingScene
      variant="inline"
      label="Panel zawodnika"
      hint="Ładujemy dane treningowe…"
    />
  );
}
