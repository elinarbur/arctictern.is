import express from "express";
import { EXAMPLE_ALERT } from "../server";

const router = express.Router();

router.get("/reikningsyfirlit", (req, res) => {
    return res.render("web-services/invoice-overview", {
        alert: EXAMPLE_ALERT,
    });
});

export const web_services_router = router;
