import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandDetail from "@/components/brand-detail";
import { allProjects } from "@/lib/portfolio-data";

export const metadata: Metadata = { title: "Film & Motion — S&K" };

export default function FilmAndMotionPage() {
  const filmMotionCollection = allProjects.find((project) => project.slug === "film-and-motion");
  if (!filmMotionCollection) notFound();
  return <BrandDetail brand={filmMotionCollection} allBrands={allProjects} />;
}
