# 🎃 Quick Start Guide - The Haunted Nexus

## 🚀 Deploy to Netlify in 5 Minutes

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/haunted-nexus.git
git push -u origin main
```

### Step 2: Deploy on Netlify
1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and select your repository
4. Netlify will auto-detect settings from `netlify.toml`
5. Click "Deploy site"

**That's it!** Your site will be live in 2-3 minutes at `https://your-site-name.netlify.app`

---

## 📁 Project Structure (Already Configured)

```
✅ frontend/              # React app (ready for Netlify)
✅ backend/               # Flask API (deploy separately)
✅ netlify.toml           # Netlify configuration
✅ DEPLOYMENT.md          # Full deployment guide
✅ .gitignore             # Git ignore rules
```

---

## 🔧 What's Already Configured

- ✅ Build command: `cd frontend && npm install && npm run build`
- ✅ Publish directory: `frontend/dist`
- ✅ SPA routing redirects
- ✅ Environment variables setup
- ✅ Security headers
- ✅ Asset caching

---

## 🎯 Next Steps After Deployment

1. **Get your Netlify URL** (e.g., `https://haunted-nexus.netlify.app`)
2. **Deploy backend** (see DEPLOYMENT.md for options)
3. **Update environment variables** in Netlify dashboard:
   - Add `VITE_API_URL` with your backend URL
4. **Redeploy** to apply changes

---

## 🧪 Test Build Locally (Optional)

```bash
cd frontend
node node_modules/vite/bin/vite.js build
node node_modules/vite/bin/vite.js preview
```

Visit `http://localhost:4173` to test the production build.

---

## 📝 Important Files

- `netlify.toml` - Netlify configuration (already set up)
- `frontend/.env.production` - Production environment variables
- `frontend/dist/` - Build output (auto-generated, don't commit)
- `DEPLOYMENT.md` - Detailed deployment instructions

---

## 🎉 You're Ready!

Your Haunted Nexus is configured and ready for deployment. Just push to GitHub and connect to Netlify!

**Need help?** Check `DEPLOYMENT.md` for detailed instructions.

👻 Happy Haunting! 🎃
