"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const COLS = 7;
const ROWS = 4;
const VISIBLE_AT_LOAD = 12;
const scene = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b3bca4"/><stop offset="1" stop-color="#9aa58b"/></linearGradient><radialGradient id="moss" cx=".45" cy=".35" r=".8"><stop stop-color="#5f9a2c"/><stop offset=".55" stop-color="#2f5d1a"/><stop offset="1" stop-color="#0f2209"/></radialGradient><radialGradient id="lime" cx=".3" cy=".3" r=".9"><stop stop-color="#c8f23a"/><stop offset="1" stop-color="#5d9a1c"/></radialGradient><filter id="fur" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence baseFrequency=".09" numOctaves="3" seed="4"/><feDisplacementMap in="SourceGraphic" scale="26"/></filter></defs><rect width="1600" height="900" fill="url(#bg)"/><path d="M1380 0h220v470c-70-40-120-120-150-200-30-80-60-170-70-270z" fill="#6d4a33"/><path d="M1250 330c90-70 220-40 350 60v400h-270c40-120 10-300-80-460z" fill="url(#lime)" filter="url(#fur)"/><path d="M0 420c110-70 230-30 320 100 90 130 70 280 90 380H0z" fill="url(#lime)" filter="url(#fur)"/><path d="M0 760c80-70 160-70 230-20l60 160H0z" fill="#7a5238"/><path d="M600 120c140-70 330-60 440 30 120 100 120 250 70 380-40 110-130 200-250 300-110-40-250-120-310-230-80-140-70-370 50-480z" fill="url(#moss)" filter="url(#fur)"/><path d="M520 700c120 80 330 100 470 40-40 80-130 160-230 180-120 20-230-80-240-220z" fill="#0b1707" opacity=".85"/><text x="800" y="360" text-anchor="middle" font-family="Arial,sans-serif" font-weight="300" font-size="122" letter-spacing="14" fill="#fff">PRØDUX</text><text x="250" y="300" font-family="Arial,sans-serif" font-size="26" fill="#fff">We turn direction</text><text x="250" y="332" font-family="Arial,sans-serif" font-size="26" fill="#fff">into identity.</text><g font-family="Arial,sans-serif" font-size="20" fill="#fff"><text x="1010" y="680">Strategy</text><text x="1010" y="706">Brand Design</text><text x="1010" y="760">Web Design</text><text x="1010" y="786">Motion</text></g></svg>`) }")`;

type Tile = { c: number; r: number; visible: boolean; sx: number; sy: number; s: number; b: number; o: number; k1: number; k2: number };

function createTiles(): Tile[] {
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const shuffle = <T,>(items: T[]) => {
    for (let i = items.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [items[i], items[j]] = [items[j], items[i]]; }
    return items;
  };
  const cells = shuffle(Array.from({ length: COLS * ROWS }, (_, i) => ({ c: i % COLS, r: Math.floor(i / COLS) })));
  const inside = shuffle(Array.from({ length: VISIBLE_AT_LOAD }, (_, i) => i)).map((i) => ({
    sx: .06 + ((i % 4 + .12 + rnd() * .76) / 4) * .88,
    sy: .08 + ((Math.floor(i / 4) + .12 + rnd() * .76) / 3) * .84,
  }));
  const hiddenCount = COLS * ROWS - VISIBLE_AT_LOAD;
  const phase = rnd();
  const outside = shuffle(Array.from({ length: hiddenCount }, (_, i) => i)).map((j) => {
    const angle = ((j + .15 + rnd() * .7) / hiddenCount + phase) * Math.PI * 2;
    const d = Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
    const k = lerp(.62, .95, rnd()) / d;
    return { sx: .5 + Math.cos(angle) * k, sy: .5 + Math.sin(angle) * k };
  });
  return cells.map((cell, i) => {
    const visible = i < VISIBLE_AT_LOAD;
    const point = visible ? inside[i] : outside[i - VISIBLE_AT_LOAD];
    return { ...cell, visible, ...point, s: visible ? lerp(.14, .7, rnd()) : lerp(.45, .9, rnd()), b: visible ? lerp(0, 6, rnd()) : lerp(8, 14, rnd()), o: visible ? (rnd() < .3 ? .4 : 1) : 0, k1: rnd(), k2: rnd() };
  });
}

export default function AssemblyHero() {
  const heroRef = useRef<HTMLElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    if (!heroRef.current || !tilesRef.current || !ctaRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const data = createTiles();
    const elements = data.map((tile) => {
      const outer = document.createElement("div"); outer.className = "tile";
      outer.style.setProperty("--c", String(tile.c)); outer.style.setProperty("--r", String(tile.r));
      const inner = document.createElement("div"); inner.className = "tile-in";
      inner.style.setProperty("--scene", scene);
      outer.appendChild(inner); tilesRef.current?.appendChild(outer);
      return { ...tile, outer, inner };
    });

    const ctx = gsap.context(() => {
      let introDone = reduceMotion;
      let floating = false;
      const floats: gsap.core.Tween[] = [];
      const startFloat = () => {
        if (floating || reduceMotion) return;
        floating = true;
        elements.filter((tile) => tile.visible).forEach((tile) => floats.push(gsap.to(tile.outer, { x: (tile.k1 - .5) * 34, y: (tile.k2 - .5) * 34, duration: 3.5 + tile.k1 * 3, ease: "sine.inOut", yoyo: true, repeat: -1 })));
      };
      const stopFloat = () => {
        floating = false;
        floats.splice(0).forEach((tween) => tween.kill());
        gsap.to(elements.map((tile) => tile.outer), { x: 0, y: 0, duration: .6, ease: "power2.out", overwrite: true });
      };

      if (!reduceMotion) {
        gsap.from(elements.filter((tile) => tile.visible).map((tile) => tile.outer), { opacity: 0, duration: 2.2, ease: "power2.out", delay: .4, stagger: { each: .22, from: "random" }, onComplete: () => { introDone = true; startFloat(); } });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current, start: "top top", end: "+=500%", pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress > .004 && floating) stopFloat();
              if (self.progress <= .004 && introDone && !floating) startFloat();
              ctaRef.current?.classList.toggle("live", self.progress > .96);
            },
          }, defaults: { ease: "none" },
        });
        elements.forEach((tile) => {
          const duration = 4.2 + tile.k1 * 2.2;
          const at = tile.visible ? tile.k2 * 2.6 : 1.6 + tile.k2 * 4.4;
          const startX = () => tile.sx * window.innerWidth - (tile.outer.offsetLeft + tile.outer.offsetWidth / 2);
          const startY = () => tile.sy * window.innerHeight - (tile.outer.offsetTop + tile.outer.offsetHeight / 2);
          timeline.fromTo(tile.inner, { x: startX, y: startY, scale: tile.s, filter: `blur(${tile.b}px)` }, { x: 0, y: 0, scale: 1, filter: "blur(0px)", duration, ease: tile.visible ? "power2.inOut" : "power3.out" }, at);
          if (tile.o < 1) timeline.fromTo(tile.inner, { opacity: tile.o }, { opacity: 1, duration: Math.min(2.2, duration * .55), ease: "power1.out" }, at);
        });
        const end = Math.max(...elements.map((tile) => (tile.visible ? 2.6 : 6) + 6.4));
        timeline.fromTo(ctaRef.current, { opacity: 0, y: 24, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "power3.out" }, end - .6);
        timeline.to({}, { duration: .8 });
      } else {
        gsap.set(elements.map((tile) => tile.inner), { clearProps: "all" });
        gsap.set(ctaRef.current, { opacity: 1 });
        ctaRef.current?.classList.add("live");
      }

      const lenis = new Lenis({ lerp: .085, wheelMultiplier: .9, autoRaf: false });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.refresh();
      return () => { gsap.ticker.remove(tick); lenis.destroy(); floats.forEach((tween) => tween.kill()); };
    }, heroRef);

    return () => { ctx.revert(); tilesRef.current?.replaceChildren(); };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    gsap.to(curtainRef.current, { opacity: 1, duration: .7, ease: "power2.inOut", onComplete: () => { window.location.href = "/work"; } });
  };

  return <>
    <section className="hero" id="hero" ref={heroRef} aria-label="Produx creative studio">
      <div className="tiles" ref={tilesRef} aria-hidden="true" />
      <header className="hero-header"><span className="wordmark">PRØDUX<span>®</span></span><span>INDEPENDENT CREATIVE STUDIO</span><span>STRATEGY · DESIGN · MOTION</span></header>
      <div className="hero-index"><span>SCROLL TO EXPLORE</span><span className="scroll-line" /></div>
      <div className="cta-wrap"><Link className="cta" href="/work" ref={ctaRef} onClick={handleClick}>Click to see <span className="arr">→</span></Link></div>
    </section>
    <div className="curtain" ref={curtainRef} />
  </>;
}

