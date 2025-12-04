# 🎃 The Haunted Nexus - Deployment Guide

## 📋 Project Structure

```
The Haunted Nexus/
├── frontend/              # React + Vite frontend (Deploy to Netlify)
│   ├── dist/             # Build output (auto-generated)
│   ├── public/           # Static assets
│   ├── src/              # Source code
│   ├── package.json      # Dependencies
│   └── vite.config.js    # Vite configuration
├── backend/              # Flask backend (Deploy separately)
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utilities
│   ├── app.py            # Main application
│   └── requirements.txt  # Python dependencies
├── netlify.toml          # Netlify configuration
└── README.md             # Project documentation
```

---

## 🚀 Deploying to Netlify (Frontend)

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Netlify will auto-detect settings from `netlify.toml`

3. **Configure Environment Variables** (if needed)
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

4. **Deploy!**
   - Click "Deploy site"
   - Your site will be live at: `https://your-site-name.netlify.app`

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
cd frontend
npm install
npm run build

# Deploy
netlify deploy --prod
```

---

## 🔧 Backend Deployment Options

Your backend needs to be deployed separately. Here are some options:

### Option 1: Render.com (Free Tier Available)
1. Create account at [Render.com](https://render.com/)
2. Create new "Web Service"
3. Connect your repository
4. Configure:
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && python app.py`
   - **Environment**: Python 3

### Option 2: Railway.app
1. Create account at [Railway.app](https://railway.app/)
2. Create new project from GitHub
3. Add environment variables
4. Deploy automatically

### Option 3: Heroku
1. Create `Procfile` in backend folder:
   ```
   web: cd backend && python app.py
   ```
2. Deploy via Heroku CLI or GitHub integration

---

## 🔑 Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (.env)
```env
OPENAI_API_KEY=your_openai_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
FLASK_ENV=production
```

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Backend deployed and URL obtained
- [ ] Frontend `.env.production` updated with backend URL
- [ ] Test build locally: `cd frontend && npm run build`
- [ ] Verify `frontend/dist/index.html` exists after build
- [ ] Push all changes to GitHub
- [ ] Configure Netlify redirects (already in `netlify.toml`)

---

## 🧪 Testing Production Build Locally

```bash
# Build the frontend
cd frontend
npm run build

# Preview the build
npm run preview

# Visit http://localhost:4173
```

---

## 📝 Build Commands Reference

### Frontend
- **Install**: `cd frontend && npm install`
- **Build**: `cd frontend && npm run build`
- **Output**: `frontend/dist/`

### Backend
- **Install**: `cd backend && pip install -r requirements.txt`
- **Run**: `cd backend && python app.py`

---

## 🐛 Troubleshooting

### Issue: 404 on page refresh
**Solution**: Already handled by `netlify.toml` redirects

### Issue: API calls failing
**Solution**: Check `VITE_API_URL` in environment variables

### Issue: Build fails
**Solution**: 
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Try building locally first

---

## 🎉 Your Site is Live!

Once deployed, your Haunted Nexus will be accessible at:
- **Frontend**: `https://your-site-name.netlify.app`
- **Backend**: `https://your-backend-url.com`

Share the link and let others enter if they dare! 👻🎃
