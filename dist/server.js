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
        const response = yield octokit.request(`GET /users/${process.env.GITHUB_USERNAME}/repos`);
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
        const response = yield octokit.request(`GET /repos/${process.env.GITHUB_USERNAME}/${repo}/commits`);
        res.status(200).json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
}));
export default (req, res) => {
    app(req, res);
};
