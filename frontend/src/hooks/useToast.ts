import { useToastStore } from "../store/toastStore";

export default function useToast() {
  const showToast = useToastStore((s) => s.showToast);
  const removeToast = useToastStore((s) => s.removeToast);
  const toasts = useToastStore((s) => s.toasts);

  return { toasts, showToast, removeToast };
}
