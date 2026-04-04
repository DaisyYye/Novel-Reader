import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppAuth } from "../auth/AuthContext";
import { PageSection } from "../components/shared/PageSection";
import { ProgressSummary } from "../components/shared/ProgressSummary";
import { useNovelDetailData } from "../hooks/useNovelDetailData";
import { updateNovel } from "../services/readerAppService";

type EditFormState = {
  title: string;
  author: string;
  description: string;
};

export function NovelDetailPage() {
  const { novelId = "" } = useParams();
  const { isAdmin } = useAppAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState<EditFormState>({
    title: "",
    author: "",
    description: "",
  });
  const { detail, progress, continueChapterId, isLoading, error } =
    useNovelDetailData(novelId, refreshKey);

  useEffect(() => {
    if (!detail) {
      return;
    }

    setForm({
      title: detail.novel.title,
      author: detail.novel.author,
      description: detail.novel.description,
    });
  }, [detail]);

  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [detail?.novel.description]);

  const handleCancel = () => {
    if (!detail) {
      return;
    }

    setForm({
      title: detail.novel.title,
      author: detail.novel.author,
      description: detail.novel.description,
    });
    setSaveError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle) {
      setSaveError("Title is required.");
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      await updateNovel(novelId, {
        title: trimmedTitle,
        author: form.author.trim(),
        description: form.description.trim(),
      });
      setIsEditing(false);
      setRefreshKey((current) => current + 1);
    } catch (saveNovelError) {
      setSaveError(
        saveNovelError instanceof Error ? saveNovelError.message : "Unable to save this novel.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-ink-500">Loading novel details...</div>;
  }

  if (error || !detail) {
    return <div className="text-sm text-red-700">Unable to load this novel.</div>;
  }

  const hasLongDescription = detail.novel.description.trim().length > 220;

  return (
    <div className="space-y-7">
      <PageSection
        title={isEditing ? form.title || "Edit novel" : detail.novel.title}
        description={isEditing ? form.author : detail.novel.author}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            {continueChapterId ? (
              <Link to={`/read/${detail.novel.id}/${continueChapterId}`} className="btn-primary">
                {progress ? `Continue chapter ${progress.chapterIndex}` : "Start reading"}
              </Link>
            ) : null}
            {isAdmin && isEditing ? (
              <>
                <button type="button" onClick={handleCancel} className="btn-secondary">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                </button>
              </>
            ) : isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  setSaveError(null);
                  setIsEditing(true);
                }}
                className="btn-secondary"
              >
                Edit details
              </button>
            ) : null}
          </div>
        }
      >
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
          <section className="surface-card">
            {isAdmin && isEditing ? (
              <div className="mb-6 space-y-4 rounded-[1.125rem] border border-black/5 bg-ink-50/70 p-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-700" htmlFor="novel-title">
                    Title
                  </label>
                  <input
                    id="novel-title"
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, title: event.target.value }))
                    }
                    className="field-control"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-700" htmlFor="novel-author">
                    Author
                  </label>
                  <input
                    id="novel-author"
                    value={form.author}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, author: event.target.value }))
                    }
                    className="field-control"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-700" htmlFor="novel-description">
                    Description
                  </label>
                  <textarea
                    id="novel-description"
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, description: event.target.value }))
                    }
                    rows={4}
                    className="field-control min-h-[8rem] resize-y"
                  />
                </div>

                {saveError ? <p className="text-sm text-red-700">{saveError}</p> : null}
              </div>
            ) : null}

            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-[2rem] leading-none text-ink-900">Chapters</h2>
              <p className="text-sm text-ink-500">{detail.chapters.length} total</p>
            </div>
            <div className="dense-list">
              {detail.chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/read/${detail.novel.id}/${chapter.id}`}
                  className={[
                    "flex items-center justify-between gap-4 py-3 text-sm transition hover:text-ink-900",
                    progress?.chapterId === chapter.id ? "text-ink-900" : "",
                  ].join(" ")}
                >
                  <div>
                    <p className="font-medium text-ink-900">{chapter.title}</p>
                    <p className="mt-0.5 text-ink-500">
                      {chapter.wordCount} words
                      {progress?.chapterId === chapter.id ? " - saved position" : ""}
                    </p>
                  </div>
                  <span className="text-ink-400">#{chapter.index}</span>
                </Link>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="surface-card-compact">
              <p className="section-eyebrow">About</p>
              <div className="mt-3 space-y-2.5">
                <p
                  className={[
                    "text-sm leading-6 text-ink-700",
                    hasLongDescription && !isDescriptionExpanded ? "line-clamp-5" : "",
                  ].join(" ")}
                >
                  {detail.novel.description}
                </p>
                {hasLongDescription ? (
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded((current) => !current)}
                    className="text-sm font-medium text-ink-700 transition hover:text-ink-900"
                  >
                    {isDescriptionExpanded ? "Show less" : "Show more"}
                  </button>
                ) : null}
              </div>
            </div>
            <div className="surface-card-compact">
              <p className="section-eyebrow">Tags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {detail.novel.tags.map((tag) => (
                  <span key={tag} className="chip bg-ink-100 text-sm text-ink-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="surface-card-compact">
              <p className="section-eyebrow">Progress</p>
              <div className="mt-3">
                <ProgressSummary progress={progress} />
              </div>
            </div>
          </aside>
        </div>
      </PageSection>
    </div>
  );
}
