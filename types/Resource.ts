export interface Space {
  id: string;
  name: string;
  /**
   * @deprecated Removed on SQLite DB version
   */
  sections: Section[] | [];
}

export interface Section {
  id: string;
  name: string;
  space_id: string;
  /**
   * @deprecated Removed on SQLite DB version
   */
  items: SectionItem[] | [];
  seq: number;
}

export interface SectionItem {
  id: string;
  icon: string;
  name: string;
  url: string;
  section_id: string;
  seq: number;
}
