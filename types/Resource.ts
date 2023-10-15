export interface Resource {
  lastModifiedDate: string;
  spaces: Space[];
}

export interface Space {
  id: string;
  name: string;
  sections: Section[] | [];
}

export interface Section {
  id: string;
  name: string;
  items: SectionItem[] | [];
}

export interface SectionItem {
  id: string;
  icon: string;
  name: string;
  url: string;
}
