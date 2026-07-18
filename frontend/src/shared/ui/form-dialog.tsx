import type * as React from "react";

import { cn } from "src/shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/shared/ui/dialog";

/** Footer styling shared by FormDialog and self-contained forms (e.g. EmployeeForm). */
export const FORM_DIALOG_FOOTER_CLASS =
  "shrink-0 border-t border-border bg-muted/40 p-4 [&_button]:h-11 [&_button]:gap-2 [&_button]:rounded-[12px] [&_button]:px-5 [&_button]:text-[13.5px] [&_button]:font-semibold [&_button[type=submit]]:px-[22px] [&_button[type=submit]]:shadow-primary-glow";

type FormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional icon shown as a badge on the left of the header. */
  icon?: React.ReactNode;
  /** Rendered as the dialog trigger (omit for externally controlled dialogs). */
  trigger?: React.ReactElement;
  /** Footer actions (e.g. cancel + submit). Omit to hide the footer. */
  footer?: React.ReactNode;
  /** Extra classes for the content (e.g. width override like `sm:max-w-2xl`). */
  className?: string;
  /**
   * Wraps `children` in a scrollable body and renders `footer` in a pinned
   * footer. Set to `false` when the child manages its own scroll/footer (e.g.
   * a self-contained form); `children` then render directly under the header.
   */
  scrollBody?: boolean;
  children: React.ReactNode;
};

/**
 * Dialog shell with a pinned header (and optional pinned footer) and a
 * scrollable body, matching the app's form-dialog design.
 */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  icon: _icon,
  trigger,
  footer,
  className,
  scrollBody = true,
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "flex max-h-[calc(100vh-56px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[660px]",
          className,
        )}
      >
        <DialogHeader className="shrink-0 border-b-2 border-border p-5">
          <DialogTitle className="text-[17.5px] font-bold tracking-[-0.3px] text-foreground">
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {scrollBody ? (
          <>
            <div className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-5">
              {children}
            </div>
            {footer && (
              <DialogFooter className={FORM_DIALOG_FOOTER_CLASS}>
                {footer}
              </DialogFooter>
            )}
          </>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
