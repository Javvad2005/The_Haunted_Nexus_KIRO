# The Haunted Nexus 👻

A Halloween-themed AI project for the Kiroween Hackathon featuring six spooky interactive experiences.

🌐 **[Live Demo](https://your-site-name.netlify.app)** | 📚 **[Deployment Guide](DEPLOYMENT.md)** | 🚀 **[Quick Start](QUICK_START.md)**

## Features

1. **Ghost Chat** 👻 - Chat with 7 distinct ghost spirits, each with unique personalities from different eras
   - The Weeping Bride (Victorian Era)
   - The Hollow Soldier (WWI)
   - The Shadow Child (Unknown)
   - The Forgotten Nun (Medieval)
   - The Butcher of Nightfall (Victorian London)
   - The Lost Scientist (Cold War)
   - The Collector (Timeless/Demonic)
2. **Haunted Journal** 📖 - Write your feelings and receive poetic haunted responses
3. **Reanimator** ⚡ - Revive old archived websites with AI
4. **Frankenstein API Stitcher** 🧪 - Combine two APIs into spooky mashups
5. **Haunted Map** 🗺️ - Explore haunted locations with AI-generated ghost stories
6. **Cursed Atelier** 📸 - Transform images into haunted masterpieces

## Tech Stack

- **Frontend**: React 18 + Vite + React Router
- **Backend**: Flask 3 + Python
- **Styling**: CSS Modules with dark theme and neon accents
- **Voice**: Web Speech API for ghost voice synthesis with persona-specific settings
- **Maps**: Leaflet for interactive haunted locations
- **AI**: Ghost Persona System with 7 unique personalities

## Key Features

### Ghost Persona System
Each ghost spirit has:
- **Unique Personality**: Distinct traits, vocabulary, and behavior patterns
- **Era-Specific Context**: Historical background from different time periods
- **Custom Voice Settings**: Personalized pitch, rate, volume, and reverb
- **Consistent Responses**: Character-driven conversations that stay in character

### Voice Synthesis
- Multiple voice presets (eerie, emotional, storyteller, whisper)
- Persona-specific voice modulation
- Text-to-speech for all ghost responses
- Adjustable volume controls

## Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your API keys
python app.py
```

The backend will run on `http://localhost:5000`

## Environment Variables

Create a `.env` file in the `backend/` directory:

```
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here
WEATHER_API_KEY=your-weather-api-key-here
```

## Project Structure

```
haunted-nexus/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── pages/     # Feature pages
│   │   ├── components/# Reusable components
│   │   ├── services/  # API and voice services
│   │   └── styles/    # Global styles
│   └── package.json
├── backend/           # Flask backend
│   ├── routes/        # API endpoints
│   ├── services/      # AI and external API services
│   ├── utils/         # Prompt templates
│   └── app.py
└── .kiro/            # Spec files
    └── specs/
        └── haunted-nexus/
```

## 🚀 Deployment

This project is **ready for deployment**! See the deployment guides:

- **Quick Start**: [QUICK_START.md](QUICK_START.md) - Deploy in 5 minutes
- **Full Guide**: [DEPLOYMENT.md](DEPLOYMENT.md) - Detailed instructions
- **Summary**: [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - What's configured

### Deploy to Netlify (Frontend)

```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# Then connect your repo to Netlify - it's auto-configured!
```

The `netlify.toml` file is already configured with:
- ✅ Build command
- ✅ Publish directory
- ✅ SPA routing
- ✅ Security headers
- ✅ Asset caching

## Development

This project is built feature-by-feature following the implementation plan in `.kiro/specs/haunted-nexus/tasks.md`.

## License

MIT
