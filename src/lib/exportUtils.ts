/**
 * iOS/iPad canvas size limits (WKWebView): max ~16M pixels total or ~4096px per side.
 * pixelRatio:2 on a 1080×1920 story = 2160×3840 = 8.3M px — exceeds limits → black image.
 * Fix: use pixelRatio:1 on iOS so canvas stays at 1080×1920 (well within limits).
 */
export const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as MacIntel with touch support
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
};

/** Safe pixel ratio: 1 on iOS/iPad, 3 on desktop (melhor qualidade de logo) */
export const safePixelRatio = (): number => (isIOS() ? 1 : 3);
