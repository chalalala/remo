import { Section, SectionItem, Space } from '@/types/Resource';
import { useCallback } from 'react';
import { findFiles, getFileContent } from '@/lib/googleDrive';
import initSqlJs, { Database } from 'sql.js';
import { sqlQuery } from '@/constants/queries';
import { exportDB } from '@/lib/sql';

export const useMigrateFromJson = () => {
  const insertSectionItems = useCallback(
    (db: Database | undefined, sectionId: string, items: SectionItem[]) => {
      if (!db) {
        return;
      }

      items.forEach((item, index) => {
        db.exec(
          `
          INSERT INTO section_items (id, name, icon, url, section_id, seq) VALUES (
          :id,
          :name,
          :icon,
          :url,
          :sectionId,
          :seq);
          `,
          {
            ':id': item.id,
            ':name': item.name,
            ':icon': item.icon,
            ':url': item.url,
            ':sectionId': sectionId,
            ':seq': index,
          },
        );
      });
    },
    [],
  );

  const insertSections = useCallback(
    (db: Database | undefined, spaceId: string, sections: Section[]) => {
      if (!db) {
        return;
      }

      sections.forEach((section, index) => {
        db.exec(
          `
          INSERT INTO sections (id, name, space_id, seq) VALUES (
          :id,
          :name,
          :spaceId,
          :seq);
          `,
          {
            ':id': section.id,
            ':name': section.name,
            ':spaceId': spaceId,
            ':seq': index,
          },
        );

        insertSectionItems(db, section.id, section.items);
      });
    },
    [insertSectionItems],
  );

  const insertSpaces = useCallback(
    (db: Database | undefined, spaces: Space[]) => {
      if (!db) {
        return;
      }

      spaces.forEach((space) => {
        db.exec('INSERT INTO spaces (id, name) VALUES (:id, :name);', {
          ':id': space.id,
          ':name': space.name,
        });

        insertSections(db, space.id, space.sections);
      });
    },
    [insertSections],
  );

  const initDatabase = async () => {
    const SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });

    const db = new SQL.Database();

    db.exec(sqlQuery.CREATE_TABLES);

    return db;
  };

  const migrateJsonToSQlite = useCallback(async () => {
    const db = await initDatabase();

    const res = await findFiles('remo_backup.json', 'application/json');

    if (res.files?.length) {
      const file = res.files[0];

      const fileContent = await getFileContent(file.id);

      const spaces: Space[] = await fileContent.json();

      insertSpaces(db, spaces);

      exportDB(db);
    }
  }, [insertSpaces]);

  return migrateJsonToSQlite;
};
