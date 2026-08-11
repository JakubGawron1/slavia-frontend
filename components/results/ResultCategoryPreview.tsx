type ResultCategoryPreviewProps = {
  category: string | null;
  /** Brak daty urodzenia lub płci w profilu zawodnika — kategoria nie może się wyliczyć. */
  missingProfileInfo: boolean;
};

export function ResultCategoryPreview({
  category,
  missingProfileInfo,
}: ResultCategoryPreviewProps) {
  return (
    <div className="flex flex-col justify-center border border-paper/10 bg-chrome/20 px-3 py-2 text-sm text-paper/70">
      {category ? (
        <>
          Kategoria: <span className="font-medium text-paper">{category}</span>
        </>
      ) : missingProfileInfo ? (
        <span className="text-paper/50">
          Brak daty urodzenia lub płci w profilu
        </span>
      ) : (
        <span className="text-paper/50">Kategoria po podaniu wagi</span>
      )}
    </div>
  );
}
