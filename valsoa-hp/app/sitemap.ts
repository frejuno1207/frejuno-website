import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/company";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/qualifications/`, priority: 0.6 },
    { url: `${SITE_URL}/recruit/`, priority: 0.6 },
  ];
}
