import { useMemo, useState } from "react";
import { useLocalStorageState } from "./useLocalStorageState";
import type { NovelSummary, ReadingProgress } from "../types/domain";

const storageKeys = {
  favoriteNovelIds: "favorite-novel-ids",
} as const;

export type LibraryView = "favorites" | "all";
export type LibrarySort = "updated" | "title" | "author";

type UseLibraryCatalogParams = {
  novels: NovelSummary[];
  progressMap: Record<string, ReadingProgress>;
};

function compareText(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

export function useLibraryCatalog({ novels, progressMap }: UseLibraryCatalogParams) {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState<LibrarySort>("updated");
  const [activeView, setActiveView] = useState<LibraryView>("all");
  const [favoriteNovelIds, setFavoriteNovelIds] = useLocalStorageState<string[]>(
    storageKeys.favoriteNovelIds,
    [],
  );

  const favoriteSet = useMemo(() => new Set(favoriteNovelIds), [favoriteNovelIds]);

  const genres = useMemo(() => {
    const values = new Set<string>();
    novels.forEach((novel) => {
      novel.tags.forEach((tag) => values.add(tag));
    });
    return ["all", ...Array.from(values).sort((a, b) => compareText(a, b))];
  }, [novels]);

  const favoriteNovels = useMemo(
    () => novels.filter((novel) => favoriteSet.has(novel.id)),
    [favoriteSet, novels],
  );

  const continueReadingNovels = useMemo(
    () => novels.filter((novel) => Boolean(progressMap[novel.id])),
    [novels, progressMap],
  );

  const filteredNovels = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const matchesView = (novel: NovelSummary) => {
      if (activeView === "favorites") {
        return favoriteSet.has(novel.id);
      }

      return true;
    };

    const matchesQuery = (novel: NovelSummary) => {
      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        novel.title,
        novel.author,
        novel.description,
        ...novel.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    };

    const matchesGenre = (novel: NovelSummary) => {
      return selectedGenre === "all" || novel.tags.includes(selectedGenre);
    };

    return novels
      .filter((novel) => matchesView(novel) && matchesQuery(novel) && matchesGenre(novel))
      .sort((left, right) => {
        if (sortBy === "title") {
          return compareText(left.title, right.title);
        }

        if (sortBy === "author") {
          return compareText(left.author, right.author);
        }

        return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
      });
  }, [activeView, favoriteSet, novels, query, selectedGenre, sortBy]);

  const toggleFavorite = (novelId: string) => {
    setFavoriteNovelIds((current) =>
      current.includes(novelId)
        ? current.filter((value) => value !== novelId)
        : [...current, novelId],
    );
  };

  return {
    query,
    setQuery,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    activeView,
    setActiveView,
    favoriteSet,
    favoriteNovels,
    continueReadingNovels,
    filteredNovels,
    genres,
    toggleFavorite,
  };
}
