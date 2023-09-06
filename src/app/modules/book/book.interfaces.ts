export type IBookFilterRequest = {
  search?: string;
  title?: string;
  author?: string;
  genre?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
};
