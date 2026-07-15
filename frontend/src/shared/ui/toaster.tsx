import { Toaster as SonnerToaster, toast } from "sonner";

function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      closeButton
      toastOptions={{
        className: "pointer-events-auto",
        classNames: {
          success:
            "bg-success! text-success-foreground! border-success! [&_[data-icon]]:text-success-foreground! [&_button]:text-success-foreground!",
        },
      }}
    />
  );
}

type CreateToastOptions = {
  title: string;
  description?: string;
  type?: "success" | "error" | "info" | "warning";
};

const toaster = {
  create: (options: CreateToastOptions) => {
    const { title, description, type } = options;
    switch (type) {
      case "success":
        toast.success(title, { description });
        break;
      case "error":
        toast.error(title, { description });
        break;
      case "warning":
        toast.warning(title, { description });
        break;
      default:
        toast(title, { description });
        break;
    }
  },
};

export { Toaster, toaster };
