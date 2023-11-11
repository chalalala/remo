import clsx from 'clsx';
import { ChangeEvent, ElementType, FC, HTMLAttributes, useState } from 'react';

interface Props extends Omit<HTMLAttributes<HTMLElement>, 'onSubmit'> {
  title: string;
  isEditing: boolean;
  defaultEditing?: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onSubmit?: (newTitle: string) => void;
  TitleWrapper?: ElementType;
}

export const EditableContent: FC<Props> = ({
  title,
  className,
  isEditing,
  TitleWrapper = 'span',
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

  if (isEditing) {
    return (
      <form
        onSubmit={onSubmitChanges}
        className={clsx('h-full w-full', className)}
      >
        <input
          className="h-full w-full border-b border-b-gray-700 outline-none"
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
      className={clsx('mb-px h-full w-full truncate', className)}
      {...props}
    >
      {editingTitle}
    </TitleWrapper>
  );
};
