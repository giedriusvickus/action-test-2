import express from "express";
import Github, { getReleases } from "./config/github";

const port = process.env.PORT || 3000;
const app = express();

app.get("/test", async (req, res) => {
    await getReleases(req, res);
});

app.listen(port);
