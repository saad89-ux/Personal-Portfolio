import type { Metadata } from "next";
import Showcase from "@/components/showcase";
import { workCards } from "@/lib/portfolio-data";

export const metadata: Metadata = { title: "Selected Work — S&K", description: "Brand identity, campaigns, and social work by S&K." };

export default function WorkPage() { return <Showcase cards={workCards} pageTitle="Selected work" />; }
