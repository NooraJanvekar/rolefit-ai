# RoleFit AI 💻

**Find your next move.**

RoleFit helps you figure out which internships and early-career roles are worth applying to.

![RoleFit landing page in pastel blue, mint, pink, and lilac](docs/screenshots/landing.png)

## Why I built it 🙋🏻‍♀️

When I was applying for internships, I kept asking myself the same questions. Does my experience fit? Am I eligible? What would I highlight on my resume if I applied? I wanted one place to work through those questions and keep track of the roles I actually wanted to pursue.

That’s why I built 'RoleFit' (I'm still working on if I like the name). 

You bring a job posting and your experience, and it helps you see where you fit, what you still need to verify, and what to do next.

## How I’d use it

1. **Start with my profile.** I add my experience, the types of roles I’m looking for, and what matters to me in my next role.
2. **Try a real posting.** I paste the job description and look at what matches, where I might need a stronger example, and which eligibility requirements I should check.
3. **Save the roles I want to revisit.** I keep the assessment, deadline, and my notes together so I can pick up where I left off.

![RoleFit dashboard showing profile completion, saved roles, and deadlines](docs/screenshots/workspace.png)

[See the mobile layout](docs/screenshots/landing-mobile.png) · [See an example assessment](docs/screenshots/analysis-example.png)

## Run this locally 🏃🏻‍♀️

Use Node.js 22.12+ or Node.js 24 and npm.

```sh
npm ci
cp .env.example .env
npm start
```

In a second terminal, run `npm run dev` and open the URL Vite prints. Vite proxies API requests to Express at port 3001.

Set `OPENAI_API_KEY` in the local `.env` to enable live analysis. `OPENAI_MODEL` defaults to `gpt-4.1-mini` and can be set to a model that supports structured outputs. OpenAI usage may incur charges. Profile setup, navigation, and the workspace run without an API key.

## How RoleFit works 🔍

**What you see.** I built the landing page and workspace with React and Vite. They share the same forms, cards, and navigation, with pastel blue, mint, pink, and lilac and dark text for readability. Aesthetics are important to me, so this was a priority! You can also go through the same steps on your phone or desktop.

**What happens when you click 'Analyze fit'.** Once you agree to share your inputs, the Express server checks them and sends your profile, résumé, and job description to OpenAI. The API key stays on the server, and RoleFit doesn’t log your résumé. OpenAI returns the assessment in a structured format. The server checks that format and looks for the quoted evidence in the text you provided before using it to calculate a score. The server also limits request size, how long a request can run, and how many requests it accepts at once.

**What gets saved.** Your profile, your last eight analyses, and your saved roles stay in the browser you used. Anyone with access to that browser profile can read the saved data, so use a browser profile you trust. You can clear it from **Career profile → Delete all RoleFit data**. That clears this browser’s copy. Anything you submit to OpenAI is handled under OpenAI’s API data policies!

## How I calculate fit 👩🏻‍🔬

I look at three things separately. **Skills** covers what the posting asks you to know. **Experience** covers what you’ve done. **Career fit** covers what you want from your next role. If you select career priorities, they get more weight in the overall score.

| What I look at | With career priorities | Without career priorities |
| --- | ---: | ---: |
| Skills | 35% | 45% |
| Experience | 30% | 40% |
| Career fit | 35% | 15% |

The model rates each area as **limited** (25), **partial** (60), **strong** (90), or **unclear** (unscored). To count toward the score, a rating needs a quote the server can find in the posting and another it can find in your supplied background or priorities. The overall score is a weighted average of the areas with evidence, rounded to the nearest five.

For example, if you picked career priorities and RoleFit can score skills and experience but can’t score career fit, it calculates the result from those first two areas and reports **65% evidence coverage** (35% for skills plus 30% for experience). Coverage tells you how much of the original weighting the score reflects.

I show **eligibility** on its own because things like graduation dates or work authorization can affect whether you can apply even when the role looks like a strong fit. Double-check any flagged requirement in the original posting. 

## How I tested it 🧪

- **Automated checks.** The tests cover scoring, missing or unsupported evidence, unexpected AI response formats, and invalid API requests. Lint checks the code, and the build checks that the app can be packaged for production.
- **Browser walkthrough.** I used Chromium to go through onboarding, edit a profile, and save, filter, and delete roles. I ran automated accessibility checks on the landing page, dashboard, and analysis screen.
- **Live analysis.** The browser walkthrough used an example AI response. Testing a real response and measuring how long it takes requires an OpenAI API key.

To rerun the automated checks locally:

```sh
npm test
npm run lint
npm run build
```

## What I’d build next 📲

I’d use this version for a local walkthrough or a private demo (so this is just between you and I). Right now, you paste the job description into RoleFit. If you include a posting URL, it’s saved so you can revisit the original listing. Your profile and saved roles are available in the browser where you created them.

Before opening RoleFit up to more people, I’d test live analysis end to end and add accounts with private storage so you can pick up on another device. I’d also add per-user request limits and decide where data is hosted and how long it’s kept. After that, I’d like to make it easier to compare roles side by side and track applications after you submit them. I think that would be cool! 

In general, this project is still in progress :) 

Thanks, 

Noora

<img width="480" height="480" alt="HeartLoveGIFbyLINEFRIENDS" src="https://github.com/user-attachments/assets/66733015-2e1a-40de-8bfc-dae2cb83a774" />


For a local preview using the production build, run `npm run build` and then `NODE_ENV=production npm start`. Express serves both the site and API on the local machine. `HOST` and `PORT` let you set the address and port in a managed environment.
