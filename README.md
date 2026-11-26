# RoleFit AI

**Clarity for your next career move.**

RoleFit helps students and early-career professionals evaluate internships and jobs against their experience, priorities, and practical constraints.

## Why I built it

While applying for internships, I found myself repeatedly comparing job descriptions with my experience, checking eligibility, identifying gaps, and deciding which opportunities were worth prioritizing. RoleFit brings those decisions into one workspace so I can see where a role fits, what I still need to verify, and what to do next.

![RoleFit landing page with an illustrative assessment](docs/screenshots/landing.png)

## What you can do

- Build a career profile with your education, experience, resume, goals, and availability.
- Paste a job posting and review skills, experience, career alignment, and eligibility separately.
- Save an opportunity with its assessment, deadline, status, and notes.
- Search, filter, and sort saved roles without making another AI request.
- See profile completeness, recent assessments, highest alignment, and upcoming deadlines in your workspace.

![RoleFit workspace after profile setup](docs/screenshots/workspace.png)

[Mobile landing page](docs/screenshots/landing-mobile.png) · [Assessment screen with example data](docs/screenshots/analysis-example.png)

## Run locally

Use Node.js 22.12+ or Node.js 24 and npm.

```sh
npm ci
cp .env.example .env
npm start
```

In a second terminal, run `npm run dev` and open the URL Vite prints. Vite proxies API requests to Express at port 3001.

Set `OPENAI_API_KEY` in the local `.env` to enable live analysis. `OPENAI_MODEL` defaults to `gpt-4.1-mini` and can be set to a model that supports structured outputs. OpenAI usage may incur charges. Profile setup, navigation, and the workspace run without an API key.

## Architecture and design

React and Vite render the landing page and workspace. The interface uses a sage and neutral palette, locally served Inter, editorial headings, and shared form, card, and navigation components. Responsive layouts keep the same workflow on smaller screens.

Express validates requests and sends consented analysis inputs to OpenAI with a server-side key. The model returns structured JSON. The server checks the response shape, verifies quoted alignment evidence against the supplied text, and derives the scores. No resume text is written to server logs. The API uses a request-size limit, a provider timeout, and a process-wide request and concurrency cap.

Profiles, up to eight recent analyses, and saved opportunities are stored in the current browser. The career profile screen can delete all RoleFit browser data. Browser storage is unencrypted and accessible to anyone with access to that browser profile. Use a trusted browser and consider removing contact details before submitting a resume. Deletion in RoleFit clears browser storage. OpenAI handles submitted information under its own API data policies.

## How alignment is scored

| Dimension | With selected priorities | Without selected priorities |
| --- | ---: | ---: |
| Skills | 35% | 45% |
| Experience | 30% | 40% |
| Career | 35% | 15% |

The model classifies each dimension using a rubric. **Limited** maps to 25, **partial** to 60, and **strong** to 90. **Unclear** and dimensions without a verified pair of excerpts remain unscored. The server normalizes the weighted average over the scored dimensions, rounds it to the nearest five, and reports the percentage of the original weight supported by evidence. Eligibility appears separately because a single requirement can determine whether you can apply. Review excerpts and verify important requirements in the original posting.

## Checks

```sh
npm test
npm run lint
npm run build
```

Tests cover scoring, missing or unsupported evidence, structured-response validation, and HTTP input validation. The browser workflow was checked in Chromium with a controlled analysis response. Automated axe checks covered the landing page, dashboard, and analysis screen. A configured provider key is needed to verify live model output and latency.

## Production build and roadmap

Run `npm run build` and then `NODE_ENV=production npm start` to serve the site and API together locally. The server binds to loopback by default. `HOST` and `PORT` configure the listener for a managed host.

The current build supports local evaluation and a private demo. Before opening it to public use, add authentication, per-user access and rate limits, server-side encrypted storage, and an approved hosting and data retention setup. The browser version has no cross-device sync. Posting imports use pasted text. The posting URL is recorded for reference. Comparison views and a dedicated application tracker are future phases.
