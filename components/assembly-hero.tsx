"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const COLS = 7;
const ROWS = 4;
const scene = `url("/folio-hero.jpg")`;

type Tile = { c: number; r: number; x: number; y: number; scale: number; blur: number; a: number; b: number };
function createTiles(): Tile[] {
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const cells = Array.from({ length: COLS * ROWS }, (_, i) => ({ c: i % COLS, r: Math.floor(i / COLS) }));
  for (let i = cells.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [cells[i], cells[j]] = [cells[j], cells[i]]; }
  return cells.map((cell) => {
    const angle = rnd() * Math.PI * 2;
    const distance = 0.66 + rnd() * 0.38;
    return { ...cell, x: Math.cos(angle) * distance * 110, y: Math.sin(angle) * distance * 95, scale: .32 + rnd() * .62, blur: 8 + rnd() * 9, a: rnd(), b: rnd() };
  });
}

export default function AssemblyHero() {
  const heroRef = useRef<HTMLElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const tileHost = tilesRef.current;
    const intro = introRef.current;
    const logo = logoRef.current;
    const cta = ctaRef.current;
    if (!hero || !tileHost || !intro || !logo || !cta) return;

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tiles = createTiles().map((tile) => {
      const outer = document.createElement("div");
      outer.className = "tile";
      outer.style.setProperty("--c", String(tile.c));
      outer.style.setProperty("--r", String(tile.r));
      const inner = document.createElement("div");
      inner.className = "tile-in";
      inner.style.setProperty("--scene", scene);
      outer.appendChild(inner);
      tileHost.appendChild(outer);
      return { ...tile, outer, inner };
    });

    let disposeMotion: (() => void) | undefined;
    const ctx = gsap.context(() => {
      const headlineLines = gsap.utils.toArray<HTMLElement>(".hero-heading-line > span", intro);
      const paragraph = intro.querySelector<HTMLElement>(".hero-description");
      const opening = gsap.timeline({ defaults: { ease: "expo.out" } });
      opening.fromTo(logo, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9 });
      opening.fromTo(headlineLines, { yPercent: 110 }, { yPercent: 0, duration: 1.05, stagger: .13 }, "-=.48");
      if (paragraph) opening.fromTo(paragraph, { opacity: 0, y: 12, filter: "blur(5px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: .8 }, "-=.45");

      if (reduceMotion) {
        gsap.set(tiles.map((tile) => tile.inner), { clearProps: "all" });
        const finish = gsap.timeline({ delay: 2.2 });
        finish.to(intro, { opacity: 0, duration: .5 }).to(tiles.map((tile) => tile.outer), { opacity: 1, duration: .65, stagger: .012 }, "<");
        finish.to(cta, { opacity: 1, y: 0, filter: "blur(0px)", duration: .45, onStart: () => cta.classList.add("live") }, "-=.15");
      } else {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero, start: "top top", end: "+=520%", pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: (self) => cta.classList.toggle("live", self.progress > .96),
          }, defaults: { ease: "none" },
        });
        timeline.to(intro, { y: () => -window.innerHeight * .88, opacity: 0, duration: 1.4 }, 0);
        timeline.to(logo, { scale: .42, transformOrigin: "top left", duration: 1.1 }, 0);
        tiles.forEach((tile) => {
          const at = 1.05 + tile.a * 4.8;
          const duration = 1.55 + tile.b * .85;
          const startX = () => tile.x * (window.innerWidth / 100);
          const startY = () => tile.y * (window.innerHeight / 100);
          timeline.fromTo(tile.outer, { x: startX, y: startY, scale: tile.scale, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration, ease: "power3.out" }, at);
          timeline.fromTo(tile.inner, { filter: `blur(${tile.blur}px)` }, { filter: "blur(0px)", duration, ease: "power2.out" }, at);
        });
        timeline.to(logo, { opacity: 0, duration: .55 }, 5.3);
        timeline.fromTo(cta, { opacity: 0, y: 24, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: .8, ease: "power3.out" }, 8.3);
        timeline.to({}, { duration: .45 });

        const lenis = new Lenis({ lerp: .085, wheelMultiplier: .9, autoRaf: false });
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        ScrollTrigger.refresh();
        disposeMotion = () => { gsap.ticker.remove(tick); lenis.destroy(); };
      }
    }, hero);

    return () => { disposeMotion?.(); ctx.revert(); tileHost.replaceChildren(); };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    gsap.to(curtainRef.current, { opacity: 1, duration: .7, ease: "power2.inOut", onComplete: () => { window.location.href = "/work"; } });
  };

  return <>
    <section className="hero" id="hero" ref={heroRef} aria-label="S&K creative studio">
      <div className="tiles" ref={tilesRef} aria-hidden="true" />
      <div className="hero-wordmark" ref={logoRef} aria-label="S&K">S&K</div>
      <div className="hero-intro-mask">
        <div className="hero-intro" ref={introRef}>
          <div className="hero-intro-content">
            <h1 className="hero-heading"><span className="hero-heading-line"><span>Independent Creative</span></span><span className="hero-heading-line"><span>Brand Design Artist</span></span></h1>
            <p className="hero-description">We build brand identities for companies that care how things feel and how they are perceived over time.</p>
          </div>
        </div>
      </div>
      <div className="cta-wrap"><Link className="cta" href="/work" ref={ctaRef} onClick={handleClick}>Click to see <span className="arr">→</span></Link></div>
    </section>
    <div className="curtain" ref={curtainRef} />
  </>;
}
