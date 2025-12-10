import { useEffect, useState } from "react";

export function useActiveSections(
  sectionIds: string[] | Readonly<string[]>,
  threshold?: number,
  rootMargin?: string,
) {
  const [active, setActive] = useState(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        threshold: threshold ?? 0.4,
        rootMargin: rootMargin ?? "-20% 0px -60% 0px",
      },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, threshold, rootMargin]);

  return active;
}
