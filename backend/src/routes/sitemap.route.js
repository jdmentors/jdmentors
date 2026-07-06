import { Router } from "express";
import Blog from "../models/blog.model.js";

const sitemapRouter = Router();

const SITE_URL = "https://www.jdmentors.com";

const staticPages = [
    "",
    "/about",
    "/contact",
    "/services",
    "/blogs",
    "/lsat-tutoring",
    "/accommodations",
    "/packages",
    "/addons",
    "/extras",
];

sitemapRouter.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find({ status: true }).select("slug updatedAt").sort({ updatedAt: -1 });

        const staticUrls = staticPages
            .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n  </url>`)
            .join("\n");

        const blogUrls = blogs
            .map((blog) => `  <url>\n    <loc>${SITE_URL}/blogs/${blog.slug}/</loc>\n    <lastmod>${blog.updatedAt.toISOString().split("T")[0]}</lastmod>\n  </url>`)
            .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticUrls}\n${blogUrls}\n</urlset>`;

        res.header("Content-Type", "application/xml");
        return res.status(200).send(xml);
    } catch (error) {
        console.error("Sitemap generation failed:", error);
        return res.status(500).send("Unable to generate sitemap");
    }
});

export default sitemapRouter;
