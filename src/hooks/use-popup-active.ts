import { useEffect } from "react";

/**
 * Toggle a `popup-open` class on <body> while a popup/modal is mounted.
 * Used (alongside CSS in styles.css) to hide the site header and apply a
 * heavy background blur whenever ANY popup is active.
 *
 * Reference-counted so nested/overlapping popups don't fight each other.
 */
let count = 0;
export function usePopupActive(active: boolean) {
  useEffect(() => {
    if (!active) return;
    count++;
    document.body.classList.add("popup-open");
    return () => {
      count = Math.max(0, count - 1);
      if (count === 0) document.body.classList.remove("popup-open");
    };
  }, [active]);
}
