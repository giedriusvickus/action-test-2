import express from "express";
import Github from "./config/github";

const port = process.env.PORT || 3000;
const app = express();

app.get("/test", async (req, res) => {
	await Github(req, res);
});

app.listen(port);
