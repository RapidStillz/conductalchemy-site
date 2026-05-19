import { useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") { onConfirm(); onCancel(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onConfirm, onCancel]);

  if (!open) return null;

  const confirmCls = {
    danger: "border-red-500/60 text-red-400 bg-red-500/5 hover:bg-red-500 hover:text-white hover:border-red-500",
    warning: "border-amber-400/60 text-amber-400 bg-amber-400/5 hover:bg-amber-400 hover:text-black hover:border-amber-400",
    default: "border-primary/60 text-primary bg-primary/5 hover:bg-primary hover:text-primary-foreground hover:border-primary",
  }[variant];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onCancel}
    >
      <div
        className="bg-[#0d0d0d] border border-border/60 p-8 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-6">
          <div className="text-[9px] font-sans tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Confirm Action
          </div>
          <h2 className="text-xl font-serif mb-3">{title}</h2>
          <p className="text-sm font-sans text-muted-foreground leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 justify-end pt-5 border-t border-border/20">
          <button
            onClick={onCancel}
            className="text-[10px] tracking-widest uppercase border border-border/50 text-muted-foreground px-5 py-2.5 hover:border-border hover:text-foreground transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); onCancel(); }}
            className={`text-[10px] tracking-widest uppercase border px-5 py-2.5 transition-colors ${confirmCls}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
