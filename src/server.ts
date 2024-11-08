import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { Octokit } from "octokit";
import { VercelRequest, VercelResponse } from "@vercel/node";

const app = express();

const octokit = new Octokit({
    auth: process.env.OCTOKIT_TOKEN
});

app.use(cors());
app.use(express.json());

// @desc Get all repositories
// @route GET /api/repos
app.get("/api/repos", async (req: Request, res: Response) => {
    try {
        const response = await octokit.request(`GET /users/${process.env.GITHUB_USERNAME}/repos?per_page=100`);
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
        const response = await octokit.request(`GET /repos/${process.env.GITHUB_USERNAME}/${repo}/commits?per_page=100`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});

// @desc Get all Commits
// @route Get /api/commits
app.get("/api/commits", async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        const todayStr = today.toISOString().split("T")[0];
        const todayUTC = `${todayStr}T15:00:00Z`;

        const response = await octokit.request(`GET /search/commits`, {
            q: `committer:${process.env.GITHUB_USERNAME} committer-date:>=${todayUTC}`,
            sort: 'committer-date',
            order: 'asc',
            per_page: 100
        });
        console.log(response.data);
        res.status(200).json(response.data)        
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});

export default (req: VercelRequest, res: VercelResponse) => {
    app(req, res);
};