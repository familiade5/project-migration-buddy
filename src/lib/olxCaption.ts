// Utilities to sanitize captions before sending to OLX / ZAP / VivaReal.
// These portals don't render emojis properly (they show as "?"), and we also
// want to strip the broker phone/contact line, since the portals provide
// their own contact channel.

// Match emoji + symbol ranges (broad coverage incl. ZWJ + variation selectors).
const EMOJI_REGEX =
  /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2460}-\u{24FF}\u{2500}-\u{257F}\u{2580}-\u{259F}\u{25A0}-\u{27BF}\u{2900}-\u{297F}\u{2B00}-\u{2BFF}\u{3030}\u{303D}\u{3297}\u{3299}\u{FE0F}\u{200D}]/gu;

const PHONE_LINE_REGEX =
  /^.*(?:\(?\d{2}\)?\s?9?\d{4,5}[-\s]?\d{4}|whats?app|telefone|tel\.?\s*:|contato\s*:|☎|📱|📞).*$/gim;

export function stripEmojis(text: string): string {
  if (!text) return '';
  return text.replace(EMOJI_REGEX, '');
}

/**
 * Returns a caption ready for OLX/ZAP/VivaReal:
 *  - removes emojis,
 *  - removes lines that contain phone numbers / "Contato" / "WhatsApp",
 *  - collapses extra blank lines and trims trailing spaces.
 */
export function sanitizeCaptionForOlx(text: string): string {
  if (!text) return '';
  const noEmojis = stripEmojis(text);
  const noPhone = noEmojis.replace(PHONE_LINE_REGEX, '');
  return noPhone
    .split('\n')
    .map((l) => l.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}