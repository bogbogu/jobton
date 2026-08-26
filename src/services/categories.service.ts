import { mainFetch } from "../api/mainFetch";

export interface CategoryCount {
  title: string;
  jobCount: number;
}

interface CategoriesResponse {
  message: string;
  categories: CategoryCount[];
}

export const categoriesService = {
  list: async () => {
    const data = await mainFetch<CategoriesResponse>(
      "/api/categories",
      undefined,
      "Unable to load categories."
    );

    return data.categories;
  },
};
