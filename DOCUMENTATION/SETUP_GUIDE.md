# 🚀 Complete Setup and Deployment Guide

This guide will walk you through setting up your PC Build Guides website locally and deploying it online for free.

## 📋 Prerequisites

- **Node.js 18+** and npm
- **Git** for version control
- **PostgreSQL database** (local or cloud)
- **Text editor** (VS Code recommended)

## 🛠️ Local Setup

### Step 1: Clone and Setup Project
Clone the repository (replace with your actual repo URL)
git clone https://github.com/yourusername/custom-pc-build-guides.git
cd custom-pc-build-guides

Install backend dependencies
cd backend
npm install

Install frontend dependencies
cd ../frontend
npm install


### Step 2: Database Configuration

#### Option A: Local PostgreSQL

Install PostgreSQL locally (if not already installed)
macOS: brew install postgresql
Ubuntu: sudo apt-get install postgresql postgresql-contrib
Windows: Download from postgresql.org
Create database
createdb pc_build_guides

Update backend/.env with your local database URL
cd backend
echo 'DATABASE_URL="postgresql://username:password@localhost:5432/pc_build_guides"' > .env
echo 'JWT_SECRET="your-super-secret-jwt-key-change-this"' >> .env
echo 'JWT_EXPIRE="7d"' >> .env
echo 'NODE_ENV="development"' >> .env
echo 'PORT=5000' >> .env
echo 'FRONTEND_URL="http://localhost:3000"' >> .env


#### Option B: Free Cloud Database (Neon.tech)

1. Go to https://neon.tech and create free account
2. Create new project and database
3. Copy connection string and update .env
cd backend
echo 'DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require"' > .env
echo 'JWT_SECRET="your-super-secret-jwt-key-change-this"' >> .env
echo 'JWT_EXPIRE="7d"' >> .env
echo 'NODE_ENV="development"' >> .env
echo 'PORT=5000' >> .env
echo 'FRONTEND_URL="http://localhost:3000"' >> .env


### Step 3: Frontend Configuration

cd ../frontend
echo 'NEXT_PUBLIC_API_URL=http://localhost:5000/api' > .env.local
echo 'NEXT_PUBLIC_APP_NAME="PC Build Guides"' >> .env.local
echo 'NEXT_PUBLIC_APP_VERSION="1.0.0"' >> .env.local


### Step 4: Database Setup


cd ../backend

Generate Prisma client
npx prisma generate

Run database migrations
npx prisma migrate dev --name init

Seed the database with sample data
npm run db:seed


### Step 5: Start Development Servers

Terminal 1 - Backend
cd backend
npm run dev

Terminal 2 - Frontend (new terminal)
cd frontend
npm run dev


### Step 6: Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database Studio**: Run `npx prisma studio` from backend folder

## 📤 Push to GitHub

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and create new repository
2. Name it `custom-pc-build-guides` (or your preferred name)
3. Don't initialize with README (we already have files)

### Step 2: Push Your Code

From project root directory
git init
git add .
git commit -m "Initial commit: Complete PC Build Guides website"

Add your GitHub repository as remote (replace with your URL)
git remote add origin https://github.com/yourusername/custom-pc-build-guides.git

Push to GitHub
git branch -M main
git push -u origin main


## 🌐 Free Online Deployment

### Option 1: Vercel + Neon (Recommended - Completely Free)

#### Backend Database (Neon.tech - Free)
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub account
3. Create new project: "pc-build-guides"
4. Copy the connection string

#### Backend API (Vercel - Free)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Click "New Project" → Import your GitHub repository
4. **Important**: Set **Root Directory** to `backend`
5. Add environment variables:
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your-256-bit-secret-key
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app

6. Deploy!
7. Note the deployment URL (e.g., `https://your-backend.vercel.app`)

#### Run Database Migration

Install Vercel CLI
npm i -g vercel

Login and link project
vercel login
cd backend
vercel link

Run migrations on production database
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed



#### Frontend (Vercel - Free)
1. Create another Vercel project
2. Import same GitHub repository
3. **Important**: Set **Root Directory** to `frontend`
4. Add environment variables:

NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
NEXT_PUBLIC_APP_NAME=PC Build Guides
NEXT_PUBLIC_APP_VERSION=1.0.0

5. Deploy!

### Option 2: Render.com (Free Tier)

#### Database (Render PostgreSQL - Free 90 days)
1. Go to [render.com](https://render.com)
2. Create account with GitHub
3. New → PostgreSQL
4. Name: `pc-build-guides-db`
5. Copy internal/external database URLs

#### Backend (Render Web Service - Free)
1. New → Web Service
2. Connect GitHub repository
3. **Root Directory**: `backend`
4. **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
5. **Start Command**: `npm start`
6. Environment variables:
DATABASE_URL=your_render_postgresql_url
JWT_SECRET=your-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-frontend.onrender.com


#### Frontend (Render Static Site - Free)
1. New → Static Site
2. Connect GitHub repository
3. **Root Directory**: `frontend`
4. **Build Command**: `npm install && npm run build`
5. **Publish Directory**: `.next`
6. Environment variables:

NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api


## 🔧 Post-Deployment Setup

### Test Your Deployment
1. Visit your frontend URL
2. Try user registration
3. Test component browsing
4. Create a sample build
5. Check compatibility checker

### Custom Domain (Optional)
- **Vercel**: Project Settings → Domains → Add custom domain
- **Render**: Dashboard → Settings → Custom Domain

## 🎉 Success!

Your PC Build Guides website is now live and accessible to users worldwide! 

**Your portfolio project is now live and showcasing your full-stack development skills to the world!** 🚀
