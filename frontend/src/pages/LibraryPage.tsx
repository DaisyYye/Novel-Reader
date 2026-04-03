import { NovelCard } from "../components/library/NovelCard";
import { PageSection } from "../components/shared/PageSection";
import { ProgressSummary } from "../components/shared/ProgressSummary";
import { useLibraryData } from "../hooks/useLibraryData";

export function LibraryPage() {
  const { novels, continueReading, progressMap, isLoading, error } = useLibraryData();

  if (isLoading) {
    return <div className="text-sm text-ink-500">Loading your library...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-700">Unable to load the library: {error}</div>;
  }

  return (
    <div className="space-y-12">
      
      <PageSection
        eyebrow="Library"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {novels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      </PageSection>
    </div>
  );
}
