export function getFirstSentence(text: string): string {
  if (!text) return "";
  const trimmed = text.trim();
  const firstSentence = trimmed.split(".")[0];
  return firstSentence.endsWith(".") ? firstSentence : firstSentence + ".";
}
