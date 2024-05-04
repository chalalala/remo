import { ChangeEvent, ElementType, FC, HTMLAttributes, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'onSubmit'> {
  title: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onSubmit?: (newTitle: string) => void;
  TitleWrapper?: ElementType;
  classNames?: {
    wrapper?: string;
    input?: string;
  };
}

export const EditableContent: FC<Props> = ({
  title,
  className,
  isEditing,
  TitleWrapper = 'span',
  classNames = {},
  setIsEditing,
  onSubmit,
  ...props
}) => {
  const [editingTitle, setEditingTitle] = useState(title);

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(event.target.value);
  };

  const onSubmitChanges = () => {
    setIsEditing(false);

    if (typeof onSubmit === 'function') {
      onSubmit(editingTitle);
    }
  };

  // Update editing title when title changes
  useEffect(() => {
    setEditingTitle(title);
  }, [title]);

  if (isEditing) {
    return (
      <form
        onSubmit={onSubmitChanges}
        className={twMerge('flex h-full w-full items-center', className, classNames.wrapper)}
      >
        <input
          className={twMerge(
            'h-full w-full border-b border-b-gray-700 outline-none',
            classNames.input,
          )}
          value={editingTitle}
          onChange={onChangeInput}
          onBlur={onSubmitChanges}
          autoFocus
        />
      </form>
    );
  }

  return (
    <TitleWrapper
      className={twMerge('flex h-full w-full items-center', className, classNames.wrapper)}
      {...props}
    >
      <span className="block truncate">{editingTitle}</span>
    </TitleWrapper>
  );
};
