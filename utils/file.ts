export const writeFile = (blobPart: BlobPart | undefined, fileName: string) => {
  if (!blobPart) {
    return;
  }

  const blob = new Blob([blobPart]);
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};
