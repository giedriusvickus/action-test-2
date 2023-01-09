import { Octokit } from "@octokit/core";

require("dotenv").config({ path: `.env.${process.env.REACT_APP_ENV}` });

const Github = async (request, response) => {
    const repo = request.params.repo;
    const workflowId = "manual-deploy-master.yml";

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    octokit.hook.error("request", async (error) => {
        console.log(error);
    });

    await octokit.request("POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches", {
        owner: "dappradar",
        repo: repo,
        ref: "master",
        workflow_id: workflowId,
        inputs: {
            sha: request.params.sha,
        },
    });

    // delay response to allow workflow to start
    await new Promise((resolve) => setTimeout(resolve, 2000));

    response.redirect(302, `https://github.com/dappradar/${repo}/actions/workflows/${workflowId}`);
};

export const getReleases = async (request, response) => {
    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    octokit.hook.error("request", async (error) => {
        console.log(error);
    });

    const releases = await octokit.request("GET /repos/giedriusvickus/action-test-1/releases", {
        owner: "giedriusvickus",
        repo: "action-test-1",
    });

    const drafts = releases.data.map((release) => {
        if (release.prerelease) {
            console.log({ name: release.name, tag: release.tag_name });
        }
        //console.log(release.draft);
        return release.prerelease && release;
    });

    printJson(response, drafts, 200);
};

export default Github;

export function printJson(response, object, status = 200) {
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Cache-Control", "public, max-age=360");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Content-Security-Policy", "frame-ancestors 'none'");

    if (status !== 200) {
        response.status(status);
    }

    const json = JSON.stringify(object);

    response.send(json);
}
