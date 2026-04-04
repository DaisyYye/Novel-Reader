import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import type { NovelSummary } from "../../types/domain";

type NovelCardProps = {
  novel: NovelSummary;
  isFavorite?: boolean;
  onToggleFavorite?: (novelId: string) => void;
  onDelete?: (novel: NovelSummary) => void;
  isDeleting?: boolean;
};

function FavoriteButton({
  novelId,
  isFavorite = false,
  onToggleFavorite,
}: {
  novelId: string;
  isFavorite?: boolean;
  onToggleFavorite?: (novelId: string) => void;
}) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleFavorite?.(novelId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="library-favorite-button"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
    >
      {isFavorite ? "\u2665" : "\u2661"}
    </button>
  );
}

export function NovelCard({
  novel,
  isFavorite = false,
  onToggleFavorite,
  onDelete,
  isDeleting = false,
}: NovelCardProps) {
  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete?.(novel);
  };

  return (
    <div className="library-book-card">
      <Link to={`/novels/${novel.id}`} className="library-book-card-link">
        <div
          className="library-book-cover"
          style={{
            background: `linear-gradient(135deg, ${novel.coverColor}, rgba(255,255,255,0.88))`,
          }}
        />

        <div className="library-book-body">
          <div className="library-book-head">
            <div className="min-w-0">
              <h2 className="library-book-title">{novel.title}</h2>
              <p className="library-book-author">{novel.author}</p>
            </div>
            <FavoriteButton
              novelId={novel.id}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          </div>

          <p className="library-book-description">{novel.description}</p>

          <div className="library-book-tags">
            {novel.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="library-book-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>

      {onDelete ? (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="inline-flex min-h-[2.25rem] items-center rounded-full border border-red-200 px-3.5 py-2 text-sm text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
