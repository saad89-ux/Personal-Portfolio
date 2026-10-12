import type { Metadata } from "next";
import BrandDetail from "@/components/brand-detail";
import { allProjects, socialCollection } from "@/lib/portfolio-data";

export const metadata: Metadata = { title: "Social Media Engagement — S&K" };

export default function SocialMediaEngagementPage() {
  return <BrandDetail brand={socialCollection} allBrands={allProjects} />;
}
