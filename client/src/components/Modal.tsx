import { createContext, useContext, useState, type ReactNode } from "react";

type Dialog = {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onDismiss?: () => void;
  showClose?: boolean;
  tone?: "default" | "danger";
};

const ModalContext = createContext<{ show: (dialog: Dialog) => void } | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [working, setWorking] = useState(false);

  const dismiss = () => {
    if (working) return;
    const onDismiss = dialog?.onDismiss;
    setDialog(null);
    onDismiss?.();
  };

  const confirm = async () => {
    if (!dialog?.onConfirm) {
      dismiss();
      return;
    }

    setWorking(true);
    try {
      await dialog.onConfirm();
      setDialog(null);
    } finally {
      setWorking(false);
    }
  };

  const showClose = dialog?.showClose !== false;

  return (
    <ModalContext.Provider value={{ show: setDialog }}>
      {children}
      {dialog && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => (showClose ? dismiss() : undefined)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="modal-card"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p className="section-label">CAKETTE</p>
            <h2 id="modal-title" className="mt-3 font-display text-4xl">
              {dialog.title}
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#786a76]">{dialog.message}</p>
            <div className="mt-7 flex flex-wrap justify-end gap-3">
              {showClose && (
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={working}
                  onClick={dismiss}
                >
                  Close
                </button>
              )}
              {dialog.onConfirm && (
                <button
                  type="button"
                  className={dialog.tone === "danger" ? "btn-danger" : "btn-primary"}
                  disabled={working}
                  onClick={() => void confirm()}
                >
                  {working ? "Please wait…" : dialog.confirmLabel ?? "Continue"}
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used inside ModalProvider");
  return context;
};
