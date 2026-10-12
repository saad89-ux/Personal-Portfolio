import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Sohaib Kamran | S&K",
  description: "Meet Sohaib Kamran, a Karachi-based creative brand designer working across identity, campaigns, and digital design.",
};

const practice = [
  { number: "01", title: "Brand identity", detail: "Distinctive identity systems, logos, colour, and typography." },
  { number: "02", title: "Social campaigns", detail: "Clear, considered creative for digital audiences and everyday brand moments." },
  { number: "03", title: "Visual direction", detail: "A consistent visual point of view across print and digital touchpoints." },
  { number: "04", title: "Illustration & assets", detail: "Supporting graphics and artwork that give a brand extra character." },
];

const experience = [
  { company: "Crystforge", role: "Brand identity design", location: "United States" },
  { company: "Danz MCI", role: "Graphic design & social campaigns", location: "Canada" },
  { company: "SAMSAL TechVortex", role: "Junior graphic designer", location: "Pakistan" },
  { company: "GAO Tek", role: "Remote graphic design internship", location: "Canada" },
];

export default function AboutPage() {
  return <main className="about-page" id="about">
    <div className="about-glow about-glow-one" aria-hidden="true" />
    <div className="about-glow about-glow-two" aria-hidden="true" />
    <header className="about-nav">
      <Link className="site-wordmark" href="/" aria-label="S&K home">S&amp;K</Link>
      <nav aria-label="Main navigation">
        <Link href="/work">SELECTED WORK ↗</Link>
        <Link href="/about" aria-current="page">[ ABOUT ]</Link>
      </nav>
    </header>

    <div className="about-content">
      <section className="about-hero">
        <div className="about-heading">
          <p className="about-kicker"><span /> INDEPENDENT CREATIVE PRACTICE</p>
          <h1>Sohaib<br />Kamran<span className="about-period">.</span></h1>
          <p className="about-role">Independent Creative Brand Design Artist</p>
        </div>
        <aside className="about-intro glass-panel">
          <p className="about-card-index">ABOUT / KARACHI, PAKISTAN</p>
          <p className="about-summary">I shape clear, expressive brand identities and digital visuals for businesses with a story to tell.</p>
          <p className="about-summary-secondary">From the first idea to the final asset, I bring thoughtful design and a consistent point of view to every touchpoint.</p>
          <a className="about-email-link" href="mailto:kamransohaib794@gmail.com">START A CONVERSATION <span aria-hidden="true">↗</span></a>
        </aside>
      </section>

      <section className="about-section about-practice" aria-labelledby="practice-heading">
        <div className="about-section-heading">
          <p className="about-kicker">WHAT I DO / 01—04</p>
          <h2 id="practice-heading">A thoughtful visual<br />language, built to last.</h2>
        </div>
        <div className="about-practice-grid">
          {practice.map((item) => <article className="about-practice-item" key={item.number}>
            <span className="about-item-number">{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>)}
        </div>
      </section>

      <section className="about-section about-experience" aria-labelledby="experience-heading">
        <div className="about-section-heading about-experience-heading">
          <p className="about-kicker">SELECTED EXPERIENCE</p>
          <h2 id="experience-heading">Work shaped<br />with good people.</h2>
        </div>
        <div className="about-experience-list">
          {experience.map((item, index) => <article className="about-experience-item" key={item.company}>
            <span className="about-item-number">0{index + 1}</span>
            <div><h3>{item.company}</h3><p>{item.role}</p></div>
            <span className="about-location">{item.location}</span>
          </article>)}
        </div>
      </section>

      <footer className="about-contact glass-panel">
        <div>
          <p className="about-kicker">HAVE A PROJECT IN MIND?</p>
          <h2>Let’s make it<br />mean something.</h2>
        </div>
        <div className="about-contact-links">
          <a className="about-email-link" href="mailto:kamransohaib794@gmail.com">EMAIL SOHAIB <span aria-hidden="true">↗</span></a>
          <a className="about-secondary-link" href="https://www.behance.net/sohaibkamran3" target="_blank" rel="noreferrer">VIEW BEHANCE ↗</a>
          <span className="about-location">KARACHI, PAKISTAN</span>
        </div>
      </footer>
    </div>
  </main>;
}
