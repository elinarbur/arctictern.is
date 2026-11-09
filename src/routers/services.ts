import express from "express";
import { EXAMPLE_ALERT } from "../server";

const router = express.Router();

router.get("/", (req, res) => {
    return res.render("services/index", {
        alert: EXAMPLE_ALERT,
    });
});

router.get("/hugbunadur", (req, res) => {
    return res.render("services/software", {
        alert: EXAMPLE_ALERT,
    });
});

router.get("/kerfisrekstur", (req, res) => {
    return res.render("web-services/invoice-overview", {
        alert: EXAMPLE_ALERT,
    });
});

router.get("/radgjof", (req, res) => {
    return res.render("web-services/invoice-overview", {
        alert: EXAMPLE_ALERT,
    });
});

router.get("/netkerfi", (req, res) => {
    return res.render("web-services/invoice-overview", {
        alert: EXAMPLE_ALERT,
    });
});

export const services_router = router;
