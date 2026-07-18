import type { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { BackButton } from "src/shared/ui/back-button";

type BackTo = {
  to: string;
  params?: ComponentProps<typeof Link>["params"];
  label?: string;
};

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  backTo?: BackTo;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  backTo,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-1">
        {backTo && (
          <BackButton to={backTo.to} params={backTo.params}>
            {backTo.label}
          </BackButton>
        )}
        <div className="flex flex-col gap-1">
          <h1 className="truncate font-bold text-2xl">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
