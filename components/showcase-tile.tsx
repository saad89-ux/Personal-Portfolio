"use client";

import { forwardRef } from "react";
import type { PortfolioItem } from "@/lib/portfolio-data";

export type ShowcaseCard = {
  id: string;
  title: string;
  category: string;
  image: string;
  coverColor: string;
  coverMark: string;
  aspect?: string;
  href?: string;
  item?: PortfolioItem;
};

type Props = { card: ShowcaseCard; index: number; onSelect?: (index: number) => void; onItemClick?: (index: number) => void };

const ShowcaseTile = forwardRef<HTMLAnchorElement, Props>(function ShowcaseTile({ card, index, onSelect, onItemClick }, ref) {
  return <a
    ref={ref}
    className="showcase-tile"
    data-showcase-tile
    data-index={index}
    href={card.href ?? `#${card.id}`}
    aria-label={`${card.category}: ${card.title}`}
    style={{ "--cover": card.coverColor, "--aspect": card.aspect ?? "16 / 9", "--roughen": `url(#roughen-${card.id})` } as React.CSSProperties}
    onClick={(event) => {
      if (onItemClick) { event.preventDefault(); onItemClick(index); }
      else onSelect?.(index);
    }}
  >
    <span className="tile-cover"><span className="cover-mark" aria-hidden="true">{card.coverMark}</span><span className="cover-name">{card.title}</span></span>
    <span className="tile-halo" aria-hidden="true"><img src={card.image} alt="" draggable="false" loading={index < 3 ? "eager" : "lazy"} /></span>
    <span className="tile-image" aria-hidden="true"><img src={card.image} alt="" draggable="false" loading={index < 3 ? "eager" : "lazy"} /></span>
    <svg className="tile-filter" width="1" height="1" viewBox="0 0 1 1" aria-hidden="true" focusable="false"><filter id={`roughen-${card.id}`} x="-35%" y="-35%" width="170%" height="170%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed={index + 3} result="noise" /><feDisplacementMap data-displace in="SourceGraphic" in2="noise" scale="32" xChannelSelector="R" yChannelSelector="G" /></filter></svg>
  </a>;
});

export default ShowcaseTile;
