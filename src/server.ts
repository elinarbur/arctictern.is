import { randomUUID } from "crypto";
import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.disable("x-powered-by");

app.use(express.json());
app.use(express.urlencoded());
app.use("/", express.static("webroot"));
app.use("/public/static", express.static("static"));

const EXAMPLE_ALERT = {
    type: "WARNING",
    message: "Bilun í stofnkerfi Mílu kann að valda truflunum fyrir viðskiptavini á Norðurlandi-Eystra",
    id: "alert_51d88fcafc9a4ae79add92cde6dac512",
};

app.get("/", (_req: Request, res: Response) => {
    return res.render("content/home", {
        alert: EXAMPLE_ALERT,
    });
});

app.get("/um-okkur", (_req: Request, res: Response) => {
    return res.render("content/about", {
        alert: EXAMPLE_ALERT,
    });
});

app.get("/hafa-samband", (_req: Request, res: Response) => {
    return res.render("content/contact", {
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
    console.log(`Server running at http://0.0.0.0:${port}`);
});
