import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { FC } from 'react';
import { Button, ButtonVariant } from '../Button';

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DuplicatedAlertModal: FC<Props> = ({ isOpen, setIsOpen, onConfirm, onCancel }) => {
  const onOpenChange = (value: boolean) => {
    if (!value) {
      onCancel();
    }

    setIsOpen(value);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[80vh] max-w-[80vw] rounded-1.5 p-4 desktop:w-[403px]">
        <DialogHeader className="text-left text-sm font-medium">
          This link is already added!
        </DialogHeader>
        <p className="text-xs">
          This link is already available in the space. Do you want to continue?
        </p>
        <div className="flex-1 space-y-4 overflow-y-auto">
          <div className="space-x-1.5 text-right">
            <Button onClick={onConfirm}>Confirm</Button>
            <Button
              variant={ButtonVariant.SECONDARY}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
