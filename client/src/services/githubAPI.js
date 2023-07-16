import { Octokit } from '@octokit-next/core';
import { backendLink } from './constants.js';

// GitHub API config
const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN
});

// Pull data from GitHub API
export default async function getGitHubData(projects, student_id) {
    const newProjects = projects.map(async p => {
        // Get the owner and the repo of the project
        // !!! data should already be available in the DB
        const matches = (p.github_link).matchAll(".*\/(.*)\/(.*)").next().value;
        const owner = matches[1];
        const repo = matches[2];

        // Paramaters object used in the API requests
        const reqParams = {
            owner: owner,
            repo: repo,
            headers: {'X-GitHub-Api-Version': '2022-11-28'}
        }

        // --------- STARRED ---------
        // Fetch all stargazers on the repo
        const stargazers = (await octokit.request(`GET /repos/${owner}/${repo}/stargazers`, reqParams)).data;

        // Fetch (from the DB) all professors
        // with type 'lab' assigned to the student;
        let labs = await fetch(`${backendLink}/api/students/${student_id}/professors/lab`, {
            header: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'GET'
        }).then(res => res.json());

        // Get their GitHub usernames
        labs = labs.map(l => (l.github_account).split("/")[3]);

        // Check if the professor is found
        // between the repo stargazers
        for(const s of stargazers)
            for(const l of labs)
                if(s.login == l)
                    p.starred = true;

        // --------- FEEDBACK ---------
        // Fetch the last comment on the repo
        let comments = (await octokit.request(`GET /repos/${owner}/${repo}/comments`, reqParams)).data;

        // Check if there are no comments on the repo
        if(!comments.length) {
            p.outdatedProject = -1;
            p.outadatedFeedback = -1;

            return p;
        }

        // Go through all the paginated data returned by the API
        // and merge it into a single array
        for(let c of comments.headers.link.split(", ")) {
            let link = c.match('(?<=<).*?(?=>)')[0];
            comments = comments.concat((await octokit.request(link)).data);
        }

        // Get the last comment on the repo
        const lastComment = comments[comments.length - 1];

        // Get the last commit on the repo
        const events = (await octokit.request(`GET /repos/${owner}/${repo}/events`, reqParams)).data;
        const lastCommit = events.find(e => e.type = 'PushEvent');

        // GitHUb API only returns events made in the last 90 days
        if(!lastCommit) {
            p.oudatedProject = -2;
            p.outdatedFeedback = -2;

            return p;
        }

        // Outdated project (no commits since last feedback)
        if(lastComment.commit_id == lastCommit.payload.commits[0].sha) {
            p.outdatedFeedback = -3;

            const commentDate = new Date(lastComment.updated_at);
            const currentDate = new Date();

            p.outdatedProject = Math.round((currentDate.getTime() - commentDate.getTime()) / (1000 * 3600 * 24));
        }

        // Outdated feedback (one or more commits since last feedback)
        else {
            p.outdatedProject = -3;

            const commentDate = new Date(lastComment.updated_at);
            
            const commitReqParams = Object.assign(reqParams, {ref: lastCommit.payload.commits[0].sha});
            const commitResp = await octokit.request(`GET /repos/${owner}/${repo}/commits/${lastCommit.payload.commits[0].sha}`, commitReqParams);
            const commitDate = new Date(commitResp.data.commit.author.date);

            p.outdatedFeedback = Math.round((commitDate.getTime() - commentDate.getTime()) / (1000 * 3600 * 24));
        }

        return p;
    });

    // Resolve all the promises of the API
    return await Promise.all(newProjects);
}