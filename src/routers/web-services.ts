import express from "express";
import { EXAMPLE_ALERT } from "../server";

const router = express.Router();

router.get("/reikningsyfirlit", (req, res) => {
    return res.render("web-services/invoice-overview", {
        _version: process.env.SOURCE_COMMIT,
        _generated: new Date().toISOString(),
        _client_ip: req.ip,
        _pathname: req.path,
        // @ts-expect-error
        _ratelimit: req.rateLimit,
        alert: EXAMPLE_ALERT,
    });
});

export const web_services_router = router;
