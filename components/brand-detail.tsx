"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import Lenis from "lenis";
import Lightbox from "@/components/lightbox";
import type { Brand, BrandBlock, BrandMedia, PortfolioItem } from "@/lib/portfolio-data";

type Props = { brand: Brand; allBrands: Brand[] };

function ImageTile({ media, aspect, onOpen }: { media: BrandMedia; aspect?: string; onOpen: () => void }) {
  return <button
    className="brand-media-tile"
    type="button"
    data-brand-reveal
    aria-label={`Open image: ${media.title}`}
    onClick={onOpen}
    style={{ "--tile-bg": media.bg ?? "#171715", "--tile-aspect": aspect ?? media.aspect ?? "16 / 9" } as CSSProperties}
  >
    <img src={media.src} alt={media.title} loading="lazy" />
    <span className="brand-expand" aria-hidden="true">↗</span>
  </button>;
}

function renderBlock(block: BrandBlock, index: number, imageIndex: Map<string, number>, openImage: (index: number) => void) {
  if (block.kind === "text") return <section className="brand-text-block" data-brand-reveal key={`text-${index}`}>
    <h2>{block.heading}</h2>
    <div className="brand-text-copy">{block.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div>
  </section>;

  if (block.kind === "pair") return <div className="brand-media-grid is-pair" key={`pair-${index}`} style={{ "--pair-aspect": block.aspect ?? "7 / 5" } as CSSProperties}>
    {block.media.map((media) => <ImageTile key={media.id} media={media} aspect={block.aspect} onOpen={() => openImage(imageIndex.get(media.id) ?? 0)} />)}
  </div>;

  if (block.kind === "video") return <div className="brand-media-grid" key={`video-${index}`}>
    <div className="brand-media-tile brand-video-tile" data-brand-reveal style={{ "--tile-bg": block.media.bg ?? "#0b0b0a", "--tile-aspect": block.media.aspect ?? "16 / 9" } as CSSProperties}>
      <BrandVideo media={block.media} />
    </div>
  </div>;

  if (block.kind === "film-collection") return <section className="brand-film-grid" aria-label="Film and motion projects" key={`film-collection-${index}`}>
    {block.films.map((film, filmIndex) => <article className="brand-film-card" data-brand-reveal key={film.media.id}>
      <div className="brand-film-frame" style={{ "--tile-bg": film.media.bg ?? "#111216", "--tile-aspect": film.media.aspect ?? "9 / 16" } as CSSProperties}>
        <BrandVideo media={film.media} />
      </div>
      <div className="brand-film-caption">
        <span className="brand-film-number">FILM {String(filmIndex + 1).padStart(2, "0")} / {String(block.films.length).padStart(2, "0")}</span>
        <h2>{film.heading}</h2>
        <p>{film.paragraph}</p>
      </div>
    </article>)}
  </section>;

  if (block.kind === "social-posts") return <section className="brand-social-grid" aria-label="Social media post designs" key={`social-posts-${index}`}>
    {block.posts.map((post, postIndex) => <article className="brand-social-card" data-brand-reveal key={post.media.id}>
      <ImageTile media={post.media} onOpen={() => openImage(imageIndex.get(post.media.id) ?? 0)} />
      <div className="brand-social-caption">
        <span className="brand-film-number">{post.brand.toUpperCase()} · {String(postIndex + 1).padStart(2, "0")} / {String(block.posts.length).padStart(2, "0")}</span>
        <h2>{post.heading}</h2>
        <p>{post.paragraph}</p>
        {post.source && <a href={post.source.href} target="_blank" rel="noreferrer">{post.source.label}</a>}
      </div>
    </article>)}
  </section>;

  return <div className="brand-media-grid" key={`full-${index}`}>
    <ImageTile media={block.media} onOpen={() => openImage(imageIndex.get(block.media.id) ?? 0)} />
  </div>;
}

function BrandVideo({ media }: { media: BrandMedia }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(preference.matches);
    const updatePreference = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) { video.pause(); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => undefined);
      else video.pause();
    }, { threshold: .12 });
    observer.observe(video);
    return () => { observer.disconnect(); video.pause(); };
  }, [reducedMotion]);

  const toggleSound = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    const video = videoRef.current;
    if (!video) return;
    video.muted = nextMuted;
    if (!nextMuted) void video.play().catch(() => undefined);
  };

  return <div className="brand-video-player">
    <video ref={videoRef} aria-label={media.title} muted={muted} loop playsInline preload="none" poster={media.poster}>
      <source src={media.src} type="video/mp4" />
    </video>
    <button className="brand-video-sound" type="button" aria-pressed={!muted} aria-label={muted ? `Turn sound on for ${media.title}` : `Mute ${media.title}`} onClick={toggleSound}>
      <span aria-hidden="true">{muted ? "♪×" : "♪"}</span>{muted ? "SOUND OFF" : "SOUND ON"}
    </button>
  </div>;
}

export default function BrandDetail({ brand, allBrands }: Props) {
  const heroRef = useRef<HTMLImageElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const imageItems = useMemo<PortfolioItem[]>(() => brand.blocks.flatMap((block) => {
    const media = block.kind === "full" || block.kind === "pair" ? (block.kind === "pair" ? block.media : [block.media])
      : block.kind === "social-posts" ? block.posts.map((post) => post.media) : [];
    return media.filter((item) => item.type === "image").map((item) => ({
      id: item.id, title: item.title, image: item.src, coverColor: item.bg ?? brand.coverColor, aspect: item.aspect,
    }));
  }), [brand.blocks, brand.coverColor]);

  const imageIndex = useMemo(() => new Map(imageItems.map((item, index) => [item.id, index])), [imageItems]);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const changeLightbox = useCallback((index: number) => setLightboxIndex(index), []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let lenis: Lenis | null = null;
    if (!reduceMotion) {
      lenis = new Lenis({ smoothWheel: true, duration: 1.05 });
      const raf = (time: number) => { lenis?.raf(time); frame = requestAnimationFrame(raf); };
      frame = requestAnimationFrame(raf);
      if (heroRef.current) gsap.fromTo(heroRef.current, { scale: 1.06 }, { scale: 1, duration: 1.3, ease: "power3.out" });
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (reduceMotion) gsap.set(entry.target, { clearProps: "opacity,transform" });
        else gsap.fromTo(entry.target, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9, ease: "power3.out", overwrite: true });
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: .08 });
    document.querySelectorAll<HTMLElement>("[data-brand-reveal]").forEach((element) => observer.observe(element));

    return () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      observer.disconnect();
      if (heroRef.current) gsap.killTweensOf(heroRef.current);
    };
  }, [brand.slug]);

  const otherBrands = allBrands.filter((project) => project.slug !== brand.slug);

  return <main className="brand-page" style={{ "--brand-wash": brand.washColor } as CSSProperties}>
    <header className="showcase-header">
      <div className="header-left"><Link className="site-wordmark" href="/work">S&amp;K</Link><Link className="back-to-work" href="/work">← ALL WORK</Link></div>
      <nav className="header-nav" aria-label="Main navigation"><a href="mailto:hello@produx.studio">[ CONTACT ]</a><button type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>[ MENU ]</button></nav>
    </header>
    {menuOpen && <nav className="menu-panel" aria-label="Site menu"><Link href="/">Home ↗</Link><Link href="/work">Selected work ↗</Link><a href="mailto:hello@produx.studio">Contact ↗</a></nav>}

    <section className="brand-intro" data-brand-reveal>
      <div className="brand-intro-copy">
        <h1>{brand.title}</h1>
        <p>{brand.tagline}</p>
      </div>
      <div className="brand-services" aria-label="Project services">{brand.services.map((service) => <span key={service}>{service}</span>)}<span>{brand.year}</span></div>
    </section>

    <div className="brand-hero" data-brand-reveal>
      <img ref={heroRef} src={brand.heroImage} alt={`${brand.title} ${brand.category.toLowerCase()} cover`} fetchPriority="high" />
    </div>

    <div className="brand-content">
      {brand.blocks.map((block, index) => renderBlock(block, index, imageIndex, setLightboxIndex))}
      <section className="brand-more" data-brand-reveal>
        <h2>See more projects</h2>
        <div className="brand-more-grid">{otherBrands.map((project) => <Link className="brand-more-card" href={project.href} key={project.slug}>
          <span className="brand-more-image" style={{ "--tile-bg": project.coverColor } as CSSProperties}><img src={project.coverImage ?? project.heroImage} alt={`${project.title} ${project.category.toLowerCase()}`} loading="lazy" /></span>
          <span className="brand-more-meta"><span>{project.title}</span><span>{project.category.toUpperCase()}</span></span>
        </Link>)}</div>
      </section>
    </div>
    <div className="brand-footer"><span>S&amp;K · 2026</span></div>
    {lightboxIndex !== null && <Lightbox items={imageItems} index={lightboxIndex} onClose={closeLightbox} onChange={changeLightbox} />}
  </main>;
}
