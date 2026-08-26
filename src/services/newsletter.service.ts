import { mainPost } from "../api/mainPost";

export const newsletterService = {
  subscribe: async (email: string) => {
    return mainPost<{ message: string }, { email: string }>(
      "/api/newsletter/subscribe",
      { email },
      undefined,
      "Unable to subscribe right now. Please try again."
    );
  },
};
