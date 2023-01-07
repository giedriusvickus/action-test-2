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

export default Github;
