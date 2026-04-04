import type { PropsWithChildren, ReactNode } from "react";

type PageSectionProps = PropsWithChildren<{
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}>;

export function PageSection({
  eyebrow,
  title,
  description,
  action,
  children,
}: PageSectionProps) {
  return (
    <section className="section-shell">
      <div className="section-head">
        <div className="section-copy">
          {eyebrow ? (
            <p className="section-eyebrow">{eyebrow}</p>
          ) : null}
          {title ? <h1 className="section-title">{title}</h1> : null}
          {description ? <p className="section-subtitle">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
