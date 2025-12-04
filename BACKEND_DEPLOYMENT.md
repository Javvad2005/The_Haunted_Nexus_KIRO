# 🔮 Backend Deployment Guide - The Haunted Nexus

## Why Personas Aren't Showing on Netlify

Your Netlify deployment only includes the **frontend** (React app). The ghost personas come from the **backend** (Flask API), which needs to be deployed separately.

**Current Status:**
- ✅ Frontend: Deployed on Netlify
- ❌ Backend: Not deployed (still needs deployment)
- ❌ API URL: Using placeholder `https://your-backend-url.com`

---

## 🚀 Quick Backend Deployment (Render.com - FREE)

### Step 1: Prepare Your Backend

Your backend is already ready! It's in the `backend/` folder.

### Step 2: Deploy to Render

1. **Go to [Render.com](https://render.com/)** and sign up (free)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure the Service**
   ```
   Name: haunted-nexus-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python app.py
   ```

4. **Set Environment Variables** (if you have API keys)
   - Click "Environment" tab
   - Add any keys from your `.env` file:
     ```
     OPENAI_API_KEY=your_key_here
     GOOGLE_MAPS_API_KEY=your_key_here
     ```

5. **Deploy!**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - You'll get a URL like: `https://haunted-nexus-backend.onrender.com`

### Step 3: Update Frontend Environment Variable

1. **Go to Netlify Dashboard**
   - Select your site
   - Go to "Site settings" → "Environment variables"

2. **Add/Update Variable**
   ```
   Key: VITE_API_URL
   Value: https://haunted-nexus-backend.onrender.com
   ```
   **IMPORTANT:** Do NOT add `/api` at the end!

3. **Redeploy Frontend**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Clear cache and deploy site"

### Step 4: Test!

Visit your Netlify site and go to Ghost Chat. The personas should now load! 👻

---

## 🔧 Alternative: Railway.app (Also FREE)

1. **Go to [Railway.app](https://railway.app/)**
2. **New Project** → "Deploy from GitHub repo"
3. **Configure**:
   - Root Directory: `backend`
   - Start Command: `python app.py`
4. **Add Environment Variables** (if needed)
5. **Deploy** - Get your URL
6. **Update Netlify** environment variable with Railway URL

---

## 🐛 Troubleshooting

### Issue: "ModuleNotFoundError" on Render
**Solution**: Make sure `requirements.txt` includes all dependencies:
```
Flask==3.0.0
Flask-CORS==4.0.0
requests==2.31.0
python-dotenv==1.0.0
beautifulsoup4==4.12.2
Pillow==10.0.0
```

### Issue: Personas still not loading
**Solution**: 
1. Check browser console for errors
2. Verify API URL doesn't have `/api` suffix
3. Test backend directly: `https://your-backend-url.com/api/ghost-personas`
4. Make sure you redeployed frontend after updating env var

### Issue: Backend takes long to start
**Solution**: Render free tier "spins down" after inactivity. First request takes 30-60 seconds. Consider upgrading or using Railway.

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Render/Railway
- [ ] Backend URL obtained (e.g., `https://haunted-nexus-backend.onrender.com`)
- [ ] Netlify environment variable updated with backend URL (NO `/api` suffix)
- [ ] Frontend redeployed on Netlify
- [ ] Tested Ghost Chat page - personas loading
- [ ] All 7 personas visible in dropdown

---

## 🎉 Once Complete

Your full stack will be live:
- **Frontend**: `https://your-site.netlify.app`
- **Backend**: `https://your-backend.onrender.com`
- **Ghost Personas**: Working! 👻

The 7 ghost personas will appear in the dropdown:
1. 💀 The Weeping Bride
2. ⚔️ The Hollow Soldier
3. 👶 The Shadow Child
4. ⛪ The Forgotten Nun
5. 🔪 The Butcher of Nightfall
6. 🧪 The Lost Scientist
7. 👁️ The Collector

Happy haunting! 🎃
