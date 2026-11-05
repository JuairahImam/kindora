import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/events", "/events/"],
      disallow: ["/create-event", "/manage-events", "/joined-events", "/profile"],
    },
    sitemap: "https://client-five-phi-98.vercel.app/sitemap.xml",
  };
}
