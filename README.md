Eleventy-powered [reading list](https://allenyin.github.io/reading_list).

Migrated from Jekyll. I don't understand how most of this works, cursor helped me build it.

## Comments (Cusdis)

Comments are powered by [Cusdis](https://cusdis.com). To enable them:

1. Create an account at [cusdis.com](https://cusdis.com) and add your site
2. Copy your App ID from the dashboard (Embed Code → `data-app-id`)
3. **Local dev:** Copy `.env.example` to `.env` and add your App ID
4. **GitHub Actions:** Add `CUSDIS_APP_ID` as a repository secret:  
   Repo → Settings → Secrets and variables → Actions → New repository secret
