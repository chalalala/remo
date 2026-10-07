import { ToastAction } from '@/components/ui/toast';
import { toast } from '@/components/ui/use-toast';

interface ActionToastOptions {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
  variant?: 'default' | 'destructive';
}

/**
 * Shows a toast with a single action button, such as "Undo" or "Reload".
 */
export const showActionToast = ({
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
}: ActionToastOptions) => {
  return toast({
    variant,
    title,
    description,
    action: (
      <ToastAction
        altText={actionLabel}
        onClick={onAction}
      >
        {actionLabel}
      </ToastAction>
    ),
  });
};
