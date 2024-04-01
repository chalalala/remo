import { Database } from 'sql.js';

export const exportDB = (db: Database | undefined) => {
  if (!db) {
    return;
  }

  const binaryArray = db.export();
  const blob = new Blob([binaryArray.buffer]);
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  const fileName = 'database.db';

  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
};
