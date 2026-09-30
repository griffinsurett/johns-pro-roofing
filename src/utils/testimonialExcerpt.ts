/** Shared by the review card and its structured-data mapping. */
export function testimonialExcerpt(content?: string) {
  const plain = (content ?? "").trim();
  const isLong = plain.length > 280;
  return {
    isLong,
    displayText: isLong ? plain.slice(0, 280).replace(/\s+\S*$/, "") + "…" : plain,
  };
}
