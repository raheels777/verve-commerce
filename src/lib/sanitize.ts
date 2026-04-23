import DOMPurify from "dompurify";

/**
 * Sanitize promo / announcement HTML to prevent XSS.
 * Only allow simple inline formatting tags. No scripts, no event handlers, no URLs.
 */
export const sanitizePromoHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty ?? "", {
    ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "span"],
    ALLOWED_ATTR: [],
  });
};
