# Cosmic Intelligence Dashboard

A COMPLETE production-grade futuristic dashboard web application. 

## Features

- **Real-time ISS Tracking:** Tracks the International Space Station on an interactive Leaflet map, refreshing every 15 seconds.
- **Speed Telemetry:** Calculates ISS velocity using the Haversine formula and visualizes it with Recharts.
- **Astronauts Manifest:** Live updates of people currently in space.
- **Intergalactic News:** Fetches the latest science and technology news, with local caching for performance.
- **Cosmic AI Assistant:** A specialized chatbot (powered by Hugging Face Mistral-7B) strictly trained to answer questions using *only* the current dashboard data.
- **Premium UI/UX:** NASA-inspired futuristic design, glassmorphism, responsive layouts, and Framer Motion animations.

## Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS + custom CSS for glassmorphism and animations
- **Maps:** Leaflet.js + React Leaflet
- **Charts:** Recharts
- **Icons & Animation:** React Icons, Framer Motion
- **AI Integration:** Hugging Face Inference API (@huggingface/inference)
- **Deployment:** Optimized for Vercel

## Environment Setup

1. Copy `.env.example` to `.env`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
2. Obtain your API keys:
   - **News API:** Get an API key from [NewsData.io](https://newsdata.io/) and set `VITE_NEWS_API_KEY`.
   - **Hugging Face AI:** Get a token from [Hugging Face](https://huggingface.co/settings/tokens) and set `VITE_AI_TOKEN`.

## Local Development

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Open the provided local URL in your browser.

## Deployment to Vercel

1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. **Environment Variables:** In the Vercel project settings, add the environment variables exactly as they are in your `.env` file (`VITE_NEWS_API_KEY`, `VITE_AI_TOKEN`).
5. Vercel will automatically detect Vite and configure the build settings (`npm run build` and `dist` output directory).
6. Click **Deploy**. Your futuristic dashboard is now live!
