var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "dotenv/config";
import express from "express";
import cors from "cors";
import { Octokit } from "octokit";
const app = express();
const octokit = new Octokit({
    auth: process.env.OCTOKIT_TOKEN
});
app.use(cors());
app.use(express.json());
// @desc Get all repositories
// @route GET /api/repos
app.get("/api/repos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield octokit.request(`GET /users/${process.env.GITHUB_USERNAME}/repos?per_page=100`);
        res.status(200).json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
}));
// @desc Get a repository
// @route GET /api/repo/:repo
app.get("/api/repo/:repo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { repo } = req.params;
    try {
        const response = yield octokit.request(`GET /repos/${process.env.GITHUB_USERNAME}/${repo}`);
        res.status(200).json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
}));
// @desc Get all repository's commits
// @route GET /api/commits/:repo
app.get("/api/commits/:repo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { repo } = req.params;
    try {
        const response = yield octokit.request(`GET /repos/${process.env.GITHUB_USERNAME}/${repo}/commits?per_page=100`);
        res.status(200).json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
}));
// @desc Get all Commits
// @route Get /api/commits
app.get("/api/commits", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        const todayStr = today.toISOString().split("T")[0];
        const todayUTC = `${todayStr}T15:00:00Z`;
        const response = yield octokit.request(`GET /search/commits`, {
            q: `committer:${process.env.GITHUB_USERNAME} committer-date:>=${todayUTC}`,
            sort: 'committer-date',
            order: 'asc',
            per_page: 100
        });
        console.log(response.data);
        res.status(200).json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
}));
export default (req, res) => {
    app(req, res);
};
