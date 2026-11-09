import { with_locale } from "@/src/i18n";
import { services_router } from "@/src/routers/services";
import { web_services_router } from "@/src/routers/web-services";
import { randomUUID } from "crypto";
import express, { Request, Response } from "express";
import { statSync } from "fs";
import rateLimit from "express-rate-limit";

const app = express();
const port = process.env.PORT || 3000;

/** Cache-buster for the stylesheet URL: changes whenever tw.min.css is rebuilt (deploy or dev watcher). */
const css_version = () => {
    try {
        return Math.floor(statSync("static/css/tw.min.css").mtimeMs).toString(36);
    } catch {
        return "0";
    }
};

app.set("view engine", "ejs");

app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 900,
        standardHeaders: "draft-6",
        legacyHeaders: false,
        ipv6Subnet: 56,
    }),
);
app.set("trust proxy", 1);
app.use("/", express.static("webroot"));
app.use("/public/static", express.static("static"));
app.use((req, res, next) => {
    res.locals._version = process.env.SOURCE_COMMIT;
    res.locals._generated = new Date().toISOString();
    res.locals._client_ip = req.ip;
    res.locals._pathname = req.path;
    // @ts-expect-error
    res.locals._ratelimit = req.rateLimit;
    res.locals.css_version = css_version();

    next();
});

/*export const EXAMPLE_ALERT = {
    type: "WARNING",
    message: {
        is: "Bilun í stofnkerfi Mílu kann að valda truflunum fyrir viðskiptavini á Norðurlandi-Eystra",
        en: "An outage in Míla's core network may cause disruptions for customers in Northeast Iceland",
    },
    id: "alert_51d88fcafc9a4ae79add92cde6dac512",
};*/
export const EXAMPLE_ALERT = null;

app.get("/health", (_req, res) => {
    return res.status(200).send("OK");
});

// All localized pages live on this router; it's mounted once per locale below.
const pages = express.Router();
pages.use("/vefthjonustur", web_services_router);
pages.use("/thjonusta", services_router);

pages.get("/", (req: Request, res: Response) => {
    return res.render("content/home", {
        alert: EXAMPLE_ALERT,
    });
});

pages.get("/um-okkur", (req: Request, res: Response) => {
    return res.render("content/about", {
        alert: EXAMPLE_ALERT,
    });
});

pages.get("/hafa-samband", (req: Request, res: Response) => {
    return res.render("content/contact", {
        alert: EXAMPLE_ALERT,
    });
});

// Dummy status data until there's a real source. Keys match t.status_page.systems / t.status_page.states.
const SYSTEM_STATUS = [
    { key: "website", state: "operational" },
    { key: "hosting", state: "operational" },
    { key: "network", state: "operational" },
    { key: "phone", state: "operational" },
    { key: "email", state: "operational" },
] as const;

pages.get("/bilanir", (req: Request, res: Response) => {
    return res.render("content/status", {
        alert: EXAMPLE_ALERT,
        incidents: EXAMPLE_ALERT ? [EXAMPLE_ALERT] : [],
        systems: SYSTEM_STATUS,
        updated_at: new Date(),
    });
});

pages.get("/skjol/almennir-skilmalar", (req: Request, res: Response) => {
    return res.render("content/document", { alert: EXAMPLE_ALERT, doc: "terms" });
});

pages.get("/skjol/personuverndarstefna", (req: Request, res: Response) => {
    return res.render("content/document", { alert: EXAMPLE_ALERT, doc: "privacy" });
});

app.use("/en", with_locale("en"), pages);
app.use("/", with_locale("is"), pages);

app.use((req: Request, res: Response) => {
    res.render("404", { pathname: req.path, requestId: randomUUID().replace(/-/g, "") }, (err, html) => {
        if (err) {
            return res.status(500);
        }

        return res.status(404).setHeader("Content-Type", "application/xml").send(html);
    });
});

app.listen(port, () => {
    console.log("Version:");
    console.log(process.env.SOURCE_COMMIT);

    console.log(`Server running at http://0.0.0.0:${port}`);
});
