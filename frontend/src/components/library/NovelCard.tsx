import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import type { NovelSummary } from "../../types/domain";

type NovelCardProps = {
  novel: NovelSummary;
  onDelete?: (novel: NovelSummary) => void;
  isDeleting?: boolean;
};

export function NovelCard({ novel, onDelete, isDeleting = false }: NovelCardProps) {
  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onDelete?.(novel);
  };

  return (
    <div className="surface-card-compact flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-black/10">
      <Link to={`/novels/${novel.id}`} className="group flex h-full flex-col">
        <div
          className="mb-4 h-36 rounded-[1rem]"
          style={{
            background: `linear-gradient(135deg, ${novel.coverColor}, rgba(255,255,255,0.65))`,
          }}
        />
        <div className="space-y-2.5">
          <div className="space-y-1">
            <h2 className="font-display text-[1.85rem] leading-[1.02] text-ink-900">{novel.title}</h2>
            <p className="text-sm text-ink-500">{novel.author}</p>
          </div>
          <p className="line-clamp-3 text-sm leading-5 text-ink-600">{novel.description}</p>
        </div>
      </Link>

      {onDelete ? (
        <div className="mt-4 flex justify-end">
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
