"use client";

import { useEffect } from "react";
import type { PortfolioItem } from "@/lib/portfolio-data";

type Props = { items: PortfolioItem[]; index: number; onClose: () => void; onChange: (index: number) => void };

export default function Lightbox({ items, index, onClose, onChange }: Props) {
  const item = items[index];
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange((index + 1) % items.length);
      if (event.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
    };
    document.body.classList.add("lightbox-open");
    window.addEventListener("keydown", handleKey);
    return () => { document.body.classList.remove("lightbox-open"); window.removeEventListener("keydown", handleKey); };
  }, [index, items.length, onChange, onClose]);
  if (!item) return null;
  return <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${item.title} artwork`} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <button className="lightbox-close" type="button" onClick={onClose} aria-label="Close lightbox">CLOSE <span>×</span></button>
    <button className="lightbox-arrow lightbox-prev" type="button" onClick={() => onChange((index - 1 + items.length) % items.length)} aria-label="Previous image">←</button>
    <figure className="lightbox-figure"><img src={item.image} alt={item.title} /><figcaption><span>{item.title}</span><span>{String(index + 1).padStart(3, "0")} / {String(items.length).padStart(3, "0")}</span></figcaption></figure>
    <button className="lightbox-arrow lightbox-next" type="button" onClick={() => onChange((index + 1) % items.length)} aria-label="Next image">→</button>
  </div>;
}
