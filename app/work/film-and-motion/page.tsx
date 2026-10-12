import type { Metadata } from "next";
import BrandDetail from "@/components/brand-detail";
import { allProjects, filmMotionCollection } from "@/lib/portfolio-data";

export const metadata: Metadata = { title: "Film & Motion — S&K" };

export default function FilmAndMotionPage() {
  return <BrandDetail brand={filmMotionCollection} allBrands={allProjects} />;
}
