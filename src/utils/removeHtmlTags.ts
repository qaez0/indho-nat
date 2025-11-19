export const cleanHtml = (content: string, length: number = 100) => {
  const strippedContent = content
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-zA-Z0-9#]+;/g, "")
    .trim();

  return strippedContent.length > length
    ? strippedContent.substring(0, length) + "..."
    : strippedContent;
};
