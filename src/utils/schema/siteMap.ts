import type { SchemaMap } from "./types";
import { testimonialExcerpt } from "@/utils/testimonialExcerpt";

export const schemaMap: SchemaMap = {
  reviews: {
    author: { from: "title", as: "text" },
    body: { resolve: ({ data }) => testimonialExcerpt(data.content).displayText },
    // Cards show the reviewer's quote, but no per-review numerical rating.
    rating: false,
  },
};
