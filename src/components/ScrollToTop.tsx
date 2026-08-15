import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Restores scroll to the top on route change, unless the URL carries a hash. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.replace('#', ''));
      if (target) {
        setTimeout(
          () => target.scrollIntoView({ behavior: 'smooth' }),
          50,
        );
        return;
      }
    }

    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}
