import type { Metadata } from "next";
import Showcase from "@/components/showcase";
import { workCards } from "@/lib/portfolio-data";

export const metadata: Metadata = { title: "Selected Work — Produx", description: "Brand identity, campaigns, and social work by Produx." };

export default function WorkPage() { return <Showcase cards={workCards} pageTitle="Selected work" />; }
