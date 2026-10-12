import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BrandDetail from "@/components/brand-detail";
import { brandBySlug, brands } from "@/lib/portfolio-data";

export function generateStaticParams() { return brands.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = brandBySlug(slug);
  return { title: brand ? `${brand.title} — S&K` : "Project not found — S&K" };
}

export default async function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = brandBySlug(slug);
  if (!brand) notFound();
  return <BrandDetail brand={brand} allBrands={brands} />;
}
