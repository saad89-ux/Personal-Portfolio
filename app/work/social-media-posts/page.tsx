import type { Metadata } from "next";
import Showcase from "@/components/showcase";
import { socialCollection } from "@/lib/portfolio-data";

export const metadata: Metadata = { title: "Social Media Engagement Posts — S&K" };

export default function SocialMediaPage() {
  return <Showcase cards={[]} detailItems={socialCollection.items} pageTitle={socialCollection.title} backHref="/work" detail />;
}
