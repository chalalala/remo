export const enum sqlQuery {
  CREATE_TABLES = `
      CREATE TABLE IF NOT EXISTS spaces (
         id binary(4) primary key,
         name varchar not null
      );

      CREATE TABLE IF NOT EXISTS sections (
         id binary(4) primary key,
         name varchar not null,
         space_id varchar not null,
         seq integer not null
      );

      CREATE TABLE IF NOT EXISTS section_items (
         id binary(4) primary key,
         name varchar not null,
         icon varchar,
         url varchar,
         section_id varchar not null,
         seq integer not null
      );
   `,

  INSERT_SPACE = `
      INSERT INTO spaces (id, name)
      VALUES (hex(randomblob(4)), :name);
   `,

  INSERT_SECTION = `
      INSERT INTO sections (id, name, space_id, seq)
      VALUES (
         hex(randomblob(4)),
         :name,
         :spaceId,
         (SELECT seq + 1 FROM sections
            WHERE space_id = :spaceId
            ORDER BY seq DESC
            LIMIT 1));
   `,

  RENAME_SECTION = `
      UPDATE sections
      SET name = :name
      WHERE id = :sectionId;
   `,

  CHANGE_SECTION_WITH_ITEM_SEQ = `
      UPDATE section_items
      SET section_id = :targetSection
      WHERE seq = :sectionItemSeq AND section_id = :sourceSection;
  `,

  DELETE_SECTION = `
      DELETE FROM sections WHERE id = :sectionId
   `,

  GET_SECTION_ITEM_SOURCE_BY_INDEX = `
      SELECT seq FROM section_items
      WHERE section_id = :sectionId
      ORDER BY seq ASC
      LIMIT 1 OFFSET :index;
   `,

  REORDER_SECTION_ITEM = `
      UPDATE section_items
      SET 
         seq =
            CASE
               WHEN seq != :sourceSeq THEN
                  CASE
                     WHEN :sourceSeq - :targetSeq > 0 THEN seq + 1
                     WHEN :sourceSeq - :targetSeq < 0 THEN seq - 1
                     ELSE seq
                  END
               WHEN seq = :sourceSeq THEN :targetSeq
            END
      WHERE seq >= MIN(:targetSeq, :sourceSeq)
      AND seq <= MAX(:sourceSeq, :targetSeq)
      AND section_id = :sourceSection;
   `,

  INSERT_SECTION_ITEM = `
      INSERT INTO section_items (id, name, icon, url, section_id, seq)
      VALUES (hex(randomblob(4)),
         :name,
         :icon,
         :url,
         :sectionId,
         (SELECT seq + 1 FROM section_items
         WHERE section_id = :sectionId
         ORDER BY seq DESC
         LIMIT 1));
    `,

  DELETE_SECTION_ITEM = `
      DELETE FROM section_items WHERE id = :itemId
   `,

  RENAME_SECTION_ITEM = `
      UPDATE section_items
      SET name = :name
      WHERE id = :itemId;
   `,

  SELECT_SPACES = `
      SELECT * FROM spaces;
   `,

  SELECT_SECTIONS = `
      SELECT * FROM sections WHERE space_id = :spaceId;
   `,

  SELECT_SECTION_ITEMS = `
      SELECT * FROM section_items WHERE section_id = :sectionId ORDER BY seq ASC;
   `,
}
