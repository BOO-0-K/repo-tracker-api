import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { Octokit } from "octokit";

const app = express();

const port = process.env.PORT || 5000;

const octokit = new Octokit({
    auth: process.env.OCTOKIT_TOKEN
});

app.use(cors());
app.use(express.json());

// @desc Get all repositories
// @route GET /api/repos
app.get("/api/repos", async (req: Request, res: Response) => {
    try {
        const response = await octokit.request(`GET /users/${process.env.GITHUB_USERNAME}/repos`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// @desc Get a repository
// @route GET /api/repo/:repo
app.get("/api/repo/:repo", async (req: Request, res: Response) => {
    const { repo } = req.params;

    try {
        const response = await octokit.request(`GET /repos/${process.env.GITHUB_USERNAME}/${repo}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// @desc Get all repository's commits
// @route GET /api/commits/:repo
app.get("/api/commits/:repo", async (req: Request, res: Response) => {
    const { repo } = req.params;

    try {
        const response = await octokit.request(`GET /repos/${process.env.GITHUB_USERNAME}/${repo}/commits`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server is running on ${port} port.`);
});