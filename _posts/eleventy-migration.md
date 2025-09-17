---
layout: post
title: "State of Vibe Coding: Blog migration from Jekyll to Eleventy" 
date: 2025-09-17
comments: false
tags:
- eleventy
- jekyll
- migration
- static site generator
---

The previous version of this blog was built with Jekyll. I'm bad at webdev and took a while to [figure it out]({{ '/tags/jekyll/' | url }}). Therefore I've been reluctant to do any refactor, UI or otherwise.

Vibe coding has been taking off recently, and reading all the optimistic user stories with cursor one-shotting projects, I decided to try it out by migrating this site from Jekyll to a more modern static site framework. My main goals:

- Automatic tag generation: Previously for each tag I had to make an independent html pag for it.
- Better latex support: This might not've been Jekyll specific, but the behavior has been very inconsistent.
- Simplified configuration: Jekyll had multiple config files.
- Flexible date handling: Previously my markdown file names had to follow certain date convention, makes writing new posts higher friction.
- Permalink system: I kept getting confused with the tag I needed to use. This is probably not Jekyll-specific, but I wanted an easier method to cross-link posts.
- Add dark mode: The ten years ago me didn't know about it..

# Good vibes

## Architecture

I started with Gemini and chatted with it about my requirements and it gave me suggestions of Hugo, Jekyll, Eleventy, and Astro. After learning about each framework on language choice (js vs. python/go), (perceived) ease of use, build speed, flexibility w.r.t templating (e.g. jekyll is very opinionated on how to structure the code), and stability, I decided on using [Eleventy](https://www.11ty.dev/).

I started with [Cursor](https://cursor.com/home?from=agents) and told the agent the current architecture of my jekyll site, my requirements of the new eleventy site, and asked it to:
- Give me a migration plan
- Keep track of the migration plan and status in a new [document](https://github.com/allenyin/reading_list/blob/refs/heads/gh-pages/jekyll_to_11ty_migration.md).

The reason for this was two-folds:
- I found this was a good way to navigate a non-trivial project. As can be seen in the document, while most of the markdown posts can stay the same, the migration involved a lot of javascript and templating changes. Web-dev link re-direction, templating syntax and css structure have always confused me, and it would've been very unmaintainable without an organized log of the entire process. Scrolling through the Cursor agent windows is very slow especially as the context got longer.
- Past experience showed me that LLMs can often get stuck in local minimum and ends up going in circles trying to solve a problem. It's only with human supervision and hinting (e.g. "stop using approach 1, 2,.. try along this way") is there hope for it get out of the rut and make progress. But giving useful hints requires the supervisor (me) to actually have an idea of what's going on. This is easy if I'm familiar with the technology, but additional cognitive scaffolding for me is needed otherwise.

The initial generated migration plan had a big-tech RFC feel to it (I wonder why..) and I had to manually trim down some verbose components.

## Cooking

The proposed plan looked fine, I then clicked through all the agent generated actions (generate new files, update existing files, terminal commands to install node components, etc). After specific steps, I would tell the agent to update what it has done in the migration document in the appropriate sections.

# Bad Vibes

Letting the agent cook got me to local testing. Everything mostly worked, but there were very subtle problems:
- Code formatting errors
- Math formatting errors
- Broken links
- Broken tags

Some of these problems had a straight-forward but not simple fix which Cursor identified, e.g. math formatting needs to be consistent in posts, but required some manual regex.

## Bad Gemini2.5-Pro

Then I ran out of free Cursor credits. As this is a one-time project, I continued with copying and pasting relevant files and describing the problem to Gemini2.5 directly -- this is an approach that I've used often in the early days of using LLMs. The difference in efficiency is immediate:
- The context availability to Gemini is limited by my understanding of the project. Even if I have prompted Gemini to ask for any additional information that it might need, it's a much slower dev process.
  - AFAIK the planning and reflection behavior in Cursor are model dependent, but Gemini isn't an available backend.
- I also started manually update sections in the migration doc, and didn't care too much to make it accurate. It's served its purpose and now the vibes are taking over. Subsequent commit notes served as my educational notes.
- I spent maybe an hour on the code formatting problem with Gemini, iterating through multiple failed solutions. It was clear that it was stuck, but I didn't know enough about Eleventy and the Nunjucks templating system to give useful hints.

## Good Claude-4-Sonnet

After two weeks I went back to it, with fresh Cursor credits. The agent solved the code formatting problem in essentially one shot. The backing model was Claude-4-sonnet, and I asked how did it know what to do. It mentioned:

> Yes, I've encountered this exact problem before - it's actually a very common issue when setting up Prism.js with static site generators like Eleventy, Jekyll, or Hugo. Here's how I diagnosed it:..
> I've seen this exact pattern in:
> Jekyll sites using Rouge + Prism
> Hugo sites with syntax highlighting
> Eleventy sites (like yours)
> Even some WordPress themes
> The solution is always the same: include the Prism JavaScript files so the line numbers plugin can run and generate the actual number elements.
> It's one of those "aha!" moments when you realize that some features need both server-side processing AND client-side JavaScript to work properly!

And there lies the importance of having good post-training data for your models!

Claude was able to one-/few-shot: implementing dark mode, theme and layout changes. When it works, very satisfying, and asking it to explain itself also accelerated my own learning process. This is peak vibe-coding.

# Importance of informed prompts

During site deployment, the site was broken -- bad styling, broken links, etc. This didn't happen during local testing. I found being very specific at describing the problems, e.g. "clicking on this link took me to this url, which gives 404" makes them much more likely to be few-shotted than saying "The links are broken!!".

This is obvious, but I suspect the lack of this practice contribute partially to the [19% slow down in developer productivity with AI](https://arxiv.org/pdf/2507.09089).

# Conclusion

## State of Vibe coding

I've started using LLMs in increasing capacity through the last two years and have personally become at least 2x more productive in terms of lines of code and diff generated in the company setting. The usage of AI tools there were mostly autocomplete, and direct chat sessions.

Cursor-style UI with tighter code context integration is super fun to work with and extremely satisfying when it works.

In my experiences now, AI-coding tools are extremely efficient when:
- The user is already a domain expert and have good context over the existing code base.
  - Better supervision and hints can be provided to the agents
  - Can break down specific tasks to delegate to the agents
- The user is a n00b and needs help ramping up on architectural decisions and learning a new framework
  - The [Eleventy documentation](https://www.11ty.dev/) sucks and I don't really want to allocate brain synapses to learning web frameworks. LLMs can explain targeted questions to me.

## Relying on training data

It was clear that Claude-4-Sonnet was better than Gemini2.5-Pro and GPT5 at solving coding problems in this instance -- it one-shotted more often and got stuck at stupid loops. But I get the sense that was likely due to having better SFT data (i.e. the problems I encountered was more in distribution with the model's training data).

If I knew as much about web-dev as either of these models, how would I have approached the problems?
- Search through the space of all potential failure points
- Evaluate which one is likely the culprit
- Test and check

The thinking models are clearly doing that to a degree. But getting stuck indicates to me that the models aren't paying attention to previously failed approaches -- one might even frame it as a continual learning problem, and limited hypothesis generation to OOD scenarios. 

## Value-add of AI products

Cursor is clearly useful and improves developer efficiency by increasing the developer-LLM bandwidth (faster context ingestion). I have not used Claude-CLI tool yet, but from what I've read it does not solve the problems of getting stuck, yet.
