import { createServer } from "http";
import { mkdirSync, writeFileSync, copyFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import handler from "serve-handler";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "dist");
const PORT = 4173;
const SITEMAP_URL = "https://jd-mentors-backend.onrender.com/sitemap.xml";

async function getPaths() {
    try {
        const res = await fetch(SITEMAP_URL);
        const xml = await res.text();
        const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
        const paths = locs.map((u) => new URL(u).pathname);
        if (paths.length === 0) throw new Error("Sitemap returned no URLs");
        return paths;
    } catch (err) {
        console.warn("Sitemap fetch failed, using fallback list:", err.message);
        return ["/", "/about", "/contact", "/services", "/blogs", "/lsat-tutoring", "/accommodations", "/packages", "/addons", "/extras"];
    }
}

const server = createServer((req, res) =>
    handler(req, res, {
        public: DIST,
        rewrites: [{ source: "**", destination: "/index.html" }],
    })
);

async function prerender() {
    await new Promise((resolve) => server.listen(PORT, resolve));

    copyFileSync(join(DIST, "index.html"), join(DIST, "200.html"));

    const paths = await getPaths();
    console.log(`Prerendering ${paths.length} pages...`);

    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
    const page = await browser.newPage();

    for (const path of paths) {
        try {
            await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "networkidle2", timeout: 60000 });
            await new Promise((r) => setTimeout(r, 1000));
            const html = await page.content();
            const outDir = path === "/" ? DIST : join(DIST, path);
            mkdirSync(outDir, { recursive: true });
            writeFileSync(join(outDir, "index.html"), html);
            console.log(`OK ${path}`);
        } catch (err) {
            console.error(`FAILED ${path}: ${err.message}`);
        }
    }

    await browser.close();
    server.close();
    console.log("Prerendering complete.");
    process.exit(0);
}

prerender().catch((err) => {
    console.error("Prerender failed:", err);
    process.exit(1);
});
