import express from "express";
import { EXAMPLE_ALERT } from "../server";

const router = express.Router();

/** URL slug -> key in t.services / t.service_pages */
export const SERVICES = [
    { slug: "hugbunadur", key: "software" },
    { slug: "kerfisrekstur", key: "operations" },
    { slug: "radgjof", key: "consulting" },
    { slug: "netkerfi", key: "networking" },
] as const;

router.get("/", (req, res) => {
    return res.render("services/index", {
        alert: EXAMPLE_ALERT,
    });
});

for (const service of SERVICES) {
    router.get(`/${service.slug}`, (req, res) => {
        return res.render("services/detail", {
            alert: EXAMPLE_ALERT,
            service,
            services: SERVICES,
        });
    });
}

export const services_router = router;
