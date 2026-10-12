"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import type { PortfolioCollection, PortfolioItem } from "@/lib/portfolio-data";
import Lightbox from "@/components/lightbox";
import ShowcaseTile, { type ShowcaseCard } from "@/components/showcase-tile";

type Mode = "vertical" | "horizontal";
type Props = { cards: PortfolioCollection[]; detailItems?: PortfolioItem[]; pageTitle?: string; backHref?: string; detail?: boolean };
const modulo = (value: number, length: number) => ((value % length) + length) % length;

export default function Showcase({ cards, detailItems, pageTitle = "Selected work", backHref, detail = false }: Props) {
  const stageRef = useRef<HTMLElement>(null);
  const positionRef = useRef({ value: 0 });
  const modeProgress = useRef({ value: 0 });
  const horizontalStepRef = useRef(0);
  const modeRef = useRef<Mode>("vertical");
  const targetRef = useRef(0);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealState = useRef(new Map<HTMLElement, gsap.core.Tween[]>());
  const filterTweens = useRef(new Map<HTMLElement, gsap.core.Tween>());
  const suppressClick = useRef(false);
  const introRunningRef = useRef(false);
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [mode, setMode] = useState<Mode>("vertical");
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const showcaseCards: ShowcaseCard[] = useMemo(() => detail
    ? (detailItems ?? []).map((item) => ({ id: item.id, title: item.title, category: pageTitle, image: item.image, coverColor: item.coverColor, coverMark: "✳", aspect: item.aspect, item }))
    : cards.map((card) => ({ id: card.slug, title: card.title, category: card.category, image: card.heroImage, coverImage: card.coverImage ?? card.heroImage, coverColor: card.coverColor, coverMark: card.coverMark, href: card.href })), [cards, detail, detailItems, pageTitle]);
  const itemList = detailItems ?? [];

  const animateReveal = useCallback((tile: HTMLElement, reveal: boolean) => {
    revealState.current.get(tile)?.forEach((tween) => tween.kill());
    const image = tile.querySelector<HTMLElement>(".tile-image");
    const halo = tile.querySelector<HTMLElement>(".tile-halo");
    const cover = tile.querySelector<HTMLElement>(".tile-cover");
    const displacement = tile.querySelector<SVGElement>("[data-displace]");
    if (!image || !halo || !cover || !displacement) return;
    const duration = reveal ? 1 : .52;
    const tweens = [
      gsap.to(image, { "--reveal": reveal ? "160%" : "0%", "--blur": reveal ? "0px" : "10px", "--zoom": reveal ? 1 : 1.15, duration, ease: reveal ? "power3.out" : "power2.inOut", overwrite: true }),
      gsap.to(halo, { "--reveal": reveal ? "178%" : "0%", opacity: reveal ? .82 : 0, duration, ease: reveal ? "power3.out" : "power2.inOut", overwrite: true }),
      gsap.to(cover, { opacity: reveal ? 0 : 1, filter: reveal ? "blur(10px)" : "blur(0px)", scale: reveal ? 1.035 : 1, duration: reveal ? .22 : .42, ease: "power2.out", overwrite: true }),
      gsap.to(displacement, { attr: { scale: reveal ? 0 : 46 }, duration, ease: reveal ? "power3.out" : "power2.inOut", overwrite: true }),
    ];
    revealState.current.set(tile, tweens);
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || !showcaseCards.length) return;
    const tiles = Array.from(stage.querySelectorAll<HTMLElement>("[data-showcase-tile]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldIntro = !detail && showcaseCards.length > 1 && !reduceMotion;
    const intro = shouldIntro ? { visible: 0, open: 0, cards: showcaseCards.map(() => ({ progress: 0 })) } : null;
    let introFinished = false;
    introRunningRef.current = shouldIntro;
    if (shouldIntro) {
      stage.dataset.intro = "running";
      stage.dataset.introPhase = "empty";
    } else {
      delete stage.dataset.intro;
      delete stage.dataset.introPhase;
    }
    const position = positionRef.current;
    const modeValue = modeProgress.current;
    let stableActive = Math.round(position.value);
    let pointerStart: { x: number; y: number; value: number } | null = null;
    let dragAxisDistance = 0;
    const min = (a: number, b: number) => a + (b - a) * modeValue.value;

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mobile = width <= 700;
      const baseTileWidth = Math.min(width * (mobile ? .78 : .29), mobile ? 520 : 560);
      const tileHeightFor = (card: ShowcaseCard) => {
        const parts = (card.aspect ?? "16 / 9").split("/").map((value) => Number(value.trim()));
        const ratio = parts[0] && parts[1] ? parts[0] / parts[1] : 16 / 9;
        const widthForCard = Math.min(baseTileWidth, height * (mobile ? .45 : .58) * ratio);
        return widthForCard / ratio;
      };
      const stepVertical = Math.max(...showcaseCards.map(tileHeightFor)) + 10;
      const horizontalSideCount = Math.max(1, Math.min(3, Math.ceil((showcaseCards.length - 1) / 2)));
      const horizontalSideMargin = Math.max(16, width * .05);
      const horizontalEdgeScale = .34;
      const stepHorizontal = Math.min(
        baseTileWidth * .68,
        Math.max(0, (width / 2 - horizontalSideMargin - baseTileWidth * horizontalEdgeScale / 2) / horizontalSideCount),
      );
      horizontalStepRef.current = stepHorizontal;
      const targetYVertical = height * .5;
      const targetYHorizontal = height * .5;

      tiles.forEach((tile, index) => {
        const relative = ((index - position.value + showcaseCards.length / 2) % showcaseCards.length + showcaseCards.length) % showcaseCards.length - showcaseCards.length / 2;
        const distance = Math.abs(relative);
        const isHorizontalScale = Math.max(.34, 1 / (1 + .25 * distance * distance));
        const verticalScale = 1 / (1 + .19 * distance);
        const scale = min(verticalScale, isHorizontalScale);
        const opacity = min(Math.max(.14, 1 - distance * .28), Math.max(.12, 1 - distance * .24));
        const aspectText = (showcaseCards[index].aspect ?? "16 / 9").split("/").map((value) => Number(value.trim()));
        const aspect = aspectText[0] && aspectText[1] ? aspectText[0] / aspectText[1] : 16 / 9;
        const tileWidth = Math.min(baseTileWidth, height * (mobile ? .45 : .58) * aspect);
        const tileHeight = tileWidth / aspect;
        const xVertical = (width - tileWidth) / 2;
        const xHorizontal = width * .5 + relative * stepHorizontal;
        const yVertical = targetYVertical + relative * stepVertical;
        const yHorizontal = targetYHorizontal;
        const x = min(xVertical + tileWidth / 2, xHorizontal + tileWidth / 2);
        const y = min(yVertical, yHorizontal);
        const measuredWidth = String(Math.round(tileWidth * 100) / 100);
        const measuredHeight = String(Math.round(tileHeight * 100) / 100);
        if (intro && !introFinished) {
          const cardProgress = intro.cards[index].progress;
          const squareSide = tileWidth * .7;
          const stackWidth = tileWidth * .5 * (1 - intro.open) + squareSide * intro.open;
          const stackHeight = tileHeight * .5 * (1 - intro.open) + squareSide * intro.open;
          const layerOffset = 2 + squareSide * .075 * intro.open;
          const stackX = width * .5 - index * layerOffset;
          const stackY = height * .55 - index * layerOffset;
          const startU = showcaseCards.length === 1 ? .5 : .12 + index / (showcaseCards.length - 1) * .76;
          const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
          const smooth = (value: number) => { const t = clamp01(value); return t * t * (3 - 2 * t); };
          const pathPoint = (u: number) => {
            const t = clamp01(u);
            const px = width * (.15 + .7 * t);
            const py = height * (.5 + .1 * (t - .5) + .09 * Math.sin(2 * Math.PI * t));
            const slope = height * (.1 + .18 * Math.PI * Math.cos(2 * Math.PI * t)) / (width * .7);
            const angle = Math.max(-14, Math.min(14, Math.atan(slope) * 180 / Math.PI));
            return { x: px, y: py, angle };
          };
          let centerX = stackX;
          let centerY = stackY;
          let poseWidth = stackWidth;
          let poseHeight = stackHeight;
          let poseScale = 1;
          let poseOpacity = intro.visible;
          let rotation = 0;
          let poseZ = 2000 - index;

          if (cardProgress > 0) {
            const enter = smooth(cardProgress / .18);
            const flow = smooth((cardProgress - .18) / .54);
            const land = smooth((cardProgress - .72) / .28);
            const start = pathPoint(startU);
            const end = pathPoint(Math.min(.98, startU + .17));
            const moving = pathPoint(startU + .17 * flow);
            const pathX = cardProgress < .18 ? start.x : moving.x;
            const pathY = cardProgress < .18 ? start.y : moving.y;
            const pathAngle = cardProgress < .18 ? start.angle : moving.angle;

            centerX = stackX + (pathX - stackX) * enter;
            centerY = stackY + (pathY - stackY) * enter;
            rotation = pathAngle * enter;
            if (cardProgress >= .18 && cardProgress < .72) { centerX = moving.x; centerY = moving.y; rotation = moving.angle; }
            if (cardProgress >= .72) {
              centerX = end.x + (x - end.x) * land;
              centerY = end.y + (y - end.y) * land;
              rotation = end.angle * (1 - land);
            }
            poseWidth = squareSide + (tileWidth - squareSide) * land;
            poseHeight = squareSide + (tileHeight - squareSide) * land;
            poseScale = 1 + (scale - 1) * land;
            poseOpacity = intro.visible * (1 + (opacity - 1) * land);
            poseZ = Math.round((2000 - index) * (1 - land) + (1000 - Math.round(distance * 10)) * land);
          }

          const poseMeasuredWidth = String(Math.round(poseWidth * 100) / 100);
          const poseMeasuredHeight = String(Math.round(poseHeight * 100) / 100);
          if (tile.dataset.layoutWidth !== poseMeasuredWidth) { tile.style.width = `${poseWidth}px`; tile.dataset.layoutWidth = poseMeasuredWidth; }
          if (tile.dataset.layoutHeight !== poseMeasuredHeight) { tile.style.height = `${poseHeight}px`; tile.dataset.layoutHeight = poseMeasuredHeight; }
          tile.style.transform = `translate3d(${centerX - poseWidth / 2}px,${centerY - poseHeight / 2}px,0) rotate(${rotation}deg) scale(${poseScale})`;
          tile.style.opacity = String(poseOpacity);
          tile.style.zIndex = String(poseZ);
          tile.style.visibility = intro.visible > 0 ? "visible" : "hidden";
          tile.style.pointerEvents = "none";
        } else {
          if (tile.dataset.layoutWidth !== measuredWidth) { tile.style.width = `${tileWidth}px`; tile.dataset.layoutWidth = measuredWidth; }
          if (tile.dataset.layoutHeight !== measuredHeight) { tile.style.height = `${tileHeight}px`; tile.dataset.layoutHeight = measuredHeight; }
          tile.style.transform = `translate3d(${x - tileWidth / 2}px,${y - tileHeight / 2}px,0) scale(${scale})`;
          tile.style.opacity = String(opacity);
          tile.style.zIndex = String(1000 - Math.round(distance * 10));
          tile.style.visibility = "";
          tile.style.pointerEvents = distance < showcaseCards.length / 2 ? "auto" : "none";
        }
      });

      const whole = Math.round(position.value);
      if (Math.abs(position.value - stableActive) > .58) stableActive = whole;
      const nextActive = modulo(stableActive, showcaseCards.length);
      if (!introRunningRef.current) setActive((previous) => previous === nextActive ? previous : nextActive);
    };

    render();
    if (intro) {
      const timeline = gsap.timeline({ onUpdate: render, onComplete: () => {
        introFinished = true;
        render();
        introRunningRef.current = false;
        delete stage.dataset.intro;
        delete stage.dataset.introPhase;
        revealTimer.current = setTimeout(() => {
          const currentActive = modulo(Math.round(position.value), tiles.length);
          animateReveal(tiles[currentActive], true);
        }, 150);
      } });
      introTimelineRef.current = timeline;
      timeline.to(intro, { visible: 1, duration: .5, ease: "power3.out" }, .1);
      timeline.to(intro, { open: 1, duration: .5, ease: "power3.out" }, .6);
      showcaseCards.forEach((_, index) => {
        timeline.to(intro.cards[index], { progress: 1, duration: 2 - index * .08, ease: "power2.inOut" }, 1.7 + index * .08);
      });
    }
    const settle = () => {
      if (introRunningRef.current) return;
      if (snapTimer.current) clearTimeout(snapTimer.current);
      snapTimer.current = setTimeout(() => {
        targetRef.current = Math.round(position.value);
        gsap.to(position, { value: targetRef.current, duration: reduceMotion ? .01 : .58, ease: "power3.out", onUpdate: render });
      }, 160);
    };
    const moveBy = (amount: number) => {
      if (introRunningRef.current) return;
      targetRef.current += amount;
      gsap.killTweensOf(position);
      gsap.to(position, { value: targetRef.current, duration: reduceMotion ? .01 : .42, ease: "power2.out", onUpdate: render });
      settle();
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (introRunningRef.current) return;
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      moveBy(delta / Math.max(180, window.innerHeight * .285) * .86);
    };
    const onKey = (event: KeyboardEvent) => {
      if (introRunningRef.current) return;
      if (event.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
      const horizontal = modeRef.current === "horizontal";
      if (event.key === "ArrowDown" || event.key === "PageDown" || (horizontal && event.key === "ArrowRight")) { event.preventDefault(); moveBy(1); }
      if (event.key === "ArrowUp" || event.key === "PageUp" || (horizontal && event.key === "ArrowLeft")) { event.preventDefault(); moveBy(-1); }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (introRunningRef.current) return;
      pointerStart = { x: event.clientX, y: event.clientY, value: position.value };
      dragAxisDistance = 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (introRunningRef.current) return;
      if (!pointerStart || event.buttons === 0) return;
      const horizontal = modeRef.current === "horizontal";
      const delta = horizontal ? pointerStart.x - event.clientX : pointerStart.y - event.clientY;
      const primary = modeRef.current === "vertical" ? Math.abs(event.clientY - pointerStart.y) : Math.abs(event.clientX - pointerStart.x);
      dragAxisDistance = Math.max(dragAxisDistance, primary);
      if (dragAxisDistance > 8) {
        suppressClick.current = true;
        gsap.killTweensOf(position);
        const stride = horizontal ? horizontalStepRef.current : Math.max(window.innerHeight * .285, window.innerWidth * .29 * 9 / 16 + 10);
        position.value = pointerStart.value + delta / Math.max(180, stride);
        targetRef.current = position.value;
        render();
      }
    };
    const onPointerUp = () => {
      if (introRunningRef.current) return;
      if (!pointerStart) return;
      const dragged = dragAxisDistance > 8;
      pointerStart = null;
      if (dragged) settle();
      window.setTimeout(() => { suppressClick.current = false; }, 80);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", render);
    return () => {
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", render);
      if (snapTimer.current) clearTimeout(snapTimer.current);
      if (revealTimer.current) clearTimeout(revealTimer.current);
      introTimelineRef.current?.kill();
      introTimelineRef.current = null;
      introRunningRef.current = false;
      if (stage.dataset.intro === "running") delete stage.dataset.intro;
      delete stage.dataset.introPhase;
      tiles.forEach((tile) => { tile.style.visibility = ""; });
      revealState.current.forEach((tweens) => tweens.forEach((tween) => tween.kill()));
      filterTweens.current.forEach((tween) => tween.kill());
      gsap.killTweensOf(position); gsap.killTweensOf(modeValue);
    };
  }, [animateReveal, detail, detailItems, pageTitle, showcaseCards]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const tiles = stage ? Array.from(stage.querySelectorAll<HTMLElement>("[data-showcase-tile]")) : [];
    if (!tiles.length) return;
    if (introRunningRef.current) return;
    tiles.forEach((tile) => {
      if (!tile.dataset.revealReady) {
        tile.dataset.revealReady = "true";
        gsap.set(tile.querySelector(".tile-image"), { "--reveal": "0%", "--blur": "10px", "--zoom": 1.15 });
        gsap.set(tile.querySelector(".tile-halo"), { "--reveal": "0%", opacity: 0 });
        gsap.set(tile.querySelector(".tile-cover"), { opacity: 1, filter: "blur(0px)" });
      }
    });
    if (revealTimer.current) clearTimeout(revealTimer.current);
    tiles.forEach((tile, index) => { if (index !== active) animateReveal(tile, false); });
    revealTimer.current = setTimeout(() => {
      const target = tiles[active];
      if (target) animateReveal(target, true);
    }, 150);
    return () => { if (revealTimer.current) clearTimeout(revealTimer.current); };
  }, [active, animateReveal]);

  const toggleMode = (next: Mode) => {
    if (introRunningRef.current) return;
    if (next === modeRef.current) return;
    modeRef.current = next;
    setMode(next);
    gsap.to(modeProgress.current, { value: next === "horizontal" ? 1 : 0, duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? .01 : 1, ease: "power3.inOut", onUpdate: () => {
      const event = new Event("resize"); window.dispatchEvent(event);
    } });
  };
  const handleTileClick = (index: number) => {
    if (suppressClick.current) return;
    // Showcase cards navigate immediately; clicking any visible card works.
    setActive(index);
  };
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const changeLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const selectItem = useCallback((index: number) => setLightboxIndex(index), []);
  const activeCard = showcaseCards[active] ?? showcaseCards[0];

  return <>
    <main className={`showcase-shell ${detail ? "is-detail" : ""}`} data-mode={mode} data-intro={!detail && showcaseCards.length > 1 ? "running" : undefined} ref={stageRef} onClickCapture={(event) => {
      if (introRunningRef.current && event.target instanceof HTMLElement && event.target.closest(".showcase-stage, .showcase-label, .showcase-dots, .full-view, .mode-toggle")) { event.preventDefault(); event.stopPropagation(); return; }
      if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); }
    }}>
      {activeCard && <div className="showcase-ambient" key={activeCard.image} aria-hidden="true"><img src={activeCard.image} alt="" /></div>}
      {showcaseCards[0] && <link rel="preload" as="image" href={showcaseCards[0].image} />}
      <header className="showcase-header">
        <div className="header-left">{backHref ? <Link className="site-wordmark" href="/work">S&K</Link> : <Link className="site-wordmark" href="/">S&K</Link>}{backHref && <Link className="back-to-work" href={backHref}>← ALL WORK</Link>}</div>
        <nav className="header-nav" aria-label="Main navigation"><a href="mailto:hello@produx.studio">[ CONTACT ]</a><button type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>[ MENU ]</button></nav>
      </header>
      {menuOpen && <nav className="menu-panel" aria-label="Site menu"><Link href="/">Home ↗</Link><Link href="/work">Selected work ↗</Link><a href="mailto:hello@produx.studio">Contact ↗</a></nav>}
      <div className="showcase-stage" aria-label={`${pageTitle} showcase`}>
      {showcaseCards.map((card, index) => <ShowcaseTile key={card.id} card={card} index={index} onSelect={handleTileClick} onItemClick={detail ? selectItem : undefined} />)}
      </div>
      <div className="showcase-label" aria-live="polite" key={`${activeCard?.id}-${mode}`}>
        <span className="label-index">{String(active + 1).padStart(3, "0")}</span>
        <span className="label-category">{detail ? pageTitle : activeCard?.category}</span>
        <span className="label-title">{activeCard?.title}</span>
      </div>
      <Link className="full-view" href="/work"><span>FULL VIEW ↗</span><span>S&K · 2026</span></Link>
      <div className="showcase-dots" aria-label="Choose a project">{showcaseCards.map((card, index) => <button key={card.id} type="button" aria-label={`Go to ${card.title}`} aria-current={index === active ? "step" : undefined} className={index === active ? "is-active" : ""} onClick={() => {
        if (introRunningRef.current) return;
        targetRef.current = index + Math.round((positionRef.current.value - index) / showcaseCards.length) * showcaseCards.length;
        gsap.to(positionRef.current, { value: targetRef.current, duration: .72, ease: "power3.out", onUpdate: () => window.dispatchEvent(new Event("resize")) });
      }} />)}</div>
      <div className="mode-toggle" aria-label="Showcase direction"><button type="button" className={mode === "vertical" ? "is-active" : ""} aria-pressed={mode === "vertical"} onClick={() => toggleMode("vertical")}>VERTICAL</button><span>·</span><button type="button" className={mode === "horizontal" ? "is-active" : ""} aria-pressed={mode === "horizontal"} onClick={() => toggleMode("horizontal")}>HORIZONTAL</button></div>
      <span className="showcase-caption">{detail ? `${showcaseCards.length} PIECES` : "INDEPENDENT CREATIVE STUDIO"}</span>
    </main>
    {detail && lightboxIndex !== null && <Lightbox items={itemList} index={lightboxIndex} onClose={closeLightbox} onChange={changeLightbox} />}
  </>;
}
