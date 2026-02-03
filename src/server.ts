import { randomUUID } from "crypto";
import express, { Request, Response } from "express";
import rateLimit from "express-rate-limit";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded());
app.use("/", express.static("webroot"));
app.use("/public/static", express.static("static"));
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 900,
        standardHeaders: "draft-6",
        legacyHeaders: false,
        ipv6Subnet: 56,
    }),
);

const EXAMPLE_ALERT = {
    type: "WARNING",
    message: "Bilun í stofnkerfi Mílu kann að valda truflunum fyrir viðskiptavini á Norðurlandi-Eystra",
    id: "alert_51d88fcafc9a4ae79add92cde6dac512",
};

app.get("/health", (_req, res) => {
    return res.status(200).send("OK");
});

app.get("/", (req: Request, res: Response) => {
    return res.render("content/home", {
        _version: process.env.SOURCE_COMMIT,
        _generated: new Date().toISOString(),
        _client_ip: req.ip,
        _pathname: req.path,
        // @ts-expect-error
        _ratelimit: req.rateLimit,
        alert: EXAMPLE_ALERT,
    });
});

app.get("/um-okkur", (req: Request, res: Response) => {
    return res.render("content/about", {
        _version: process.env.SOURCE_COMMIT,
        _generated: new Date().toISOString(),
        _client_ip: req.ip,
        _pathname: req.path,
        // @ts-expect-error
        _ratelimit: req.rateLimit,
        alert: EXAMPLE_ALERT,
    });
});

app.get("/hafa-samband", (req: Request, res: Response) => {
    return res.render("content/contact", {
        _version: process.env.SOURCE_COMMIT,
        _generated: new Date().toISOString(),
        _client_ip: req.ip,
        _pathname: req.path,
        // @ts-expect-error
        _ratelimit: req.rateLimit,
        alert: EXAMPLE_ALERT,
    });
});

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
