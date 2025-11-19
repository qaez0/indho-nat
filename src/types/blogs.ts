export interface IBlog {
  id: number;
  title: string;
  content: string;
  image: string;
  is_home: number;
  is_headline: number;
  date_display: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export type Article = Pick<
  IBlog,
  "id" | "title" | "content" | "image" | "date_display"
>;
